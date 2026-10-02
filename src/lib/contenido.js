/**
 * Contenido publicado, leído de Supabase en la compilación (especificación §3.5 y §5.5).
 *
 * Se usa la clave pública: RLS garantiza que solo llegue lo publicado, con fecha cumplida y no
 * eliminado. Si Supabase está configurado y falla, la compilación falla: desplegar un listado
 * vacío borraría las publicaciones del sitio, mientras que una compilación fallida deja en línea
 * la versión anterior. Sin configuración (desarrollo local sin claves), devuelve listas vacías.
 */
import { MAX_RELACIONADAS, POR_PAGINA, VARIANTES_PORTADA } from '@/config/publicaciones';
import { clientePublico, SUPABASE_CONFIGURADO, urlPublica } from './supabase';
import { sanearHtml } from './sanear';

const CAMPOS_POST = [
  'id',
  'type',
  'title',
  'slug',
  'excerpt',
  'body_html',
  'body_text',
  'cover_path',
  'cover_alt',
  'author_id',
  'practice_area',
  'published_at',
  'updated_at',
  'meta_title',
  'meta_description',
  'og_image_path',
  'reading_minutes',
  'previous_slugs',
  'post_tags(tags(id, name, slug))',
].join(', ');

const CAMPOS_LECTURA =
  'id, title, source_name, url, comment, published_at, external_read_tags(tags(id, name, slug))';

/**
 * @typedef {{ id: string, name: string, slug: string }} Etiqueta
 * @typedef {{
 *   id: string, tipo: 'articulo' | 'caso', titulo: string, slug: string, extracto: string,
 *   html: string, portada: { grande: string, mediana: string, alt: string } | null,
 *   autor: string | null, area: string | null, fecha: string, actualizada: string,
 *   metaTitulo: string, metaDescripcion: string, imagenSocial: string | null,
 *   minutos: number, slugsAnteriores: string[], etiquetas: Etiqueta[]
 * }} Publicacion
 * @typedef {{
 *   id: string, titulo: string, fuente: string, url: string, comentario: string,
 *   fecha: string, etiquetas: Etiqueta[]
 * }} Lectura
 */

/** Minutos de lectura a 200 palabras por minuto, si el panel no los fijó. */
function minutosDeLectura(texto) {
  const palabras = (texto ?? '').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palabras / 200));
}

/** @returns {Publicacion} */
function aPublicacion(fila, autores) {
  const grande = urlPublica(fila.cover_path);
  return {
    id: fila.id,
    tipo: fila.type,
    titulo: fila.title,
    slug: fila.slug,
    extracto: fila.excerpt ?? '',
    html: sanearHtml(fila.body_html ?? ''),
    portada: grande
      ? {
          grande,
          mediana: grande.endsWith(VARIANTES_PORTADA.grande)
            ? grande.slice(0, -VARIANTES_PORTADA.grande.length) + VARIANTES_PORTADA.mediana
            : grande,
          alt: fila.cover_alt ?? '',
        }
      : null,
    autor: autores.get(fila.author_id) ?? null,
    area: fila.practice_area,
    fecha: fila.published_at,
    actualizada: fila.updated_at,
    metaTitulo: fila.meta_title || fila.title,
    metaDescripcion: fila.meta_description || fila.excerpt || '',
    imagenSocial: urlPublica(fila.og_image_path) ?? grande,
    minutos: fila.reading_minutes ?? minutosDeLectura(fila.body_text),
    slugsAnteriores: fila.previous_slugs ?? [],
    etiquetas: (fila.post_tags ?? []).map((r) => r.tags).filter(Boolean),
  };
}

/** @returns {Lectura} */
function aLectura(fila) {
  return {
    id: fila.id,
    titulo: fila.title,
    fuente: fila.source_name,
    url: fila.url,
    comentario: fila.comment ?? '',
    fecha: fila.published_at,
    etiquetas: (fila.external_read_tags ?? []).map((r) => r.tags).filter(Boolean),
  };
}

/** @param {{ error: any }} respuesta @param {string} que */
function verificar(respuesta, que) {
  if (respuesta.error) {
    throw new Error(`No se pudo leer ${que} de Supabase: ${respuesta.error.message}`);
  }
  return respuesta.data ?? [];
}

/** @type {Promise<{ publicaciones: Publicacion[], lecturas: Lectura[], etiquetas: Etiqueta[] }> | null} */
let cache = null;

/**
 * Filas tal como las devuelve Supabase. Con CONTENIDO_DE_PRUEBA=1 vienen de un archivo local con
 * texto inequívocamente de prueba, para revisar las páginas sin publicar nada ficticio (regla 2).
 * Esa fuente se niega a funcionar en CI: nunca puede llegar a un despliegue.
 */
async function obtenerFilas() {
  if (process.env.CONTENIDO_DE_PRUEBA === '1') {
    if (process.env.CI)
      throw new Error('CONTENIDO_DE_PRUEBA no puede usarse en CI ni en despliegues.');
    console.warn('Aviso: se usa CONTENIDO_DE_PRUEBA. Esta compilación no debe desplegarse.');
    return (await import('../../pruebas/contenido-de-prueba.js')).filas;
  }

  const cliente = clientePublico();
  if (!cliente) {
    if (!SUPABASE_CONFIGURADO) {
      console.warn('Aviso: Supabase no está configurado; las publicaciones se generan vacías.');
    }
    return { posts: [], lecturas: [], autores: [] };
  }

  const [posts, lecturas, autores] = await Promise.all([
    cliente.from('posts').select(CAMPOS_POST).order('published_at', { ascending: false }),
    cliente
      .from('external_reads')
      .select(CAMPOS_LECTURA)
      .order('published_at', { ascending: false }),
    cliente.rpc('autores_publicos'),
  ]);
  return {
    posts: verificar(posts, 'las publicaciones'),
    lecturas: verificar(lecturas, 'las lecturas recomendadas'),
    autores: verificar(autores, 'los autores'),
  };
}

async function cargar() {
  const filas = await obtenerFilas();
  const mapaAutores = new Map(filas.autores.map((a) => [a.id, a.full_name]));
  const publicaciones = filas.posts.map((f) => aPublicacion(f, mapaAutores));
  const listaLecturas = filas.lecturas.map(aLectura);

  // Solo las etiquetas con al menos un contenido publicado (§5.5).
  const usadas = new Map();
  for (const item of [...publicaciones, ...listaLecturas]) {
    for (const e of item.etiquetas) usadas.set(e.slug, e);
  }
  const etiquetas = [...usadas.values()].sort((a, b) => a.name.localeCompare(b.name, 'es'));

  return { publicaciones, lecturas: listaLecturas, etiquetas };
}

/** Contenido publicado. Se lee una vez por proceso de compilación. */
export function obtenerContenido() {
  cache ??= cargar();
  return cache;
}

/**
 * Divide una lista en páginas de POR_PAGINA elementos.
 * @template T
 * @param {T[]} lista
 */
export function paginar(lista, porPagina = POR_PAGINA) {
  const total = Math.max(1, Math.ceil(lista.length / porPagina));
  return {
    total,
    pagina: (n) => lista.slice((n - 1) * porPagina, n * porPagina),
  };
}

/**
 * Hasta MAX_RELACIONADAS publicaciones que comparten más etiquetas con `actual`; a igualdad,
 * las más recientes.
 * @param {Publicacion} actual
 * @param {Publicacion[]} todas
 */
export function relacionadas(actual, todas) {
  const propias = new Set(actual.etiquetas.map((e) => e.slug));
  if (propias.size === 0) return [];
  return todas
    .filter((p) => p.id !== actual.id)
    .map((p) => ({ p, comunes: p.etiquetas.filter((e) => propias.has(e.slug)).length }))
    .filter(({ comunes }) => comunes > 0)
    .sort((a, b) => b.comunes - a.comunes || b.p.fecha.localeCompare(a.p.fecha))
    .slice(0, MAX_RELACIONADAS)
    .map(({ p }) => p);
}
