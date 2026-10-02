/**
 * Búsqueda en el navegador contra la función RPC buscar_contenido (especificación §5.6 y §6.4).
 * El cliente de Supabase se carga solo al buscar, para no sumar peso al resto de páginas.
 */

/**
 * @typedef {{ tipo: 'articulo' | 'caso' | 'lectura', id: string, titulo: string, slug: string | null,
 *   url: string | null, fuente: string | null, fragmento: string, fecha: string }} Resultado
 */

async function cliente() {
  const { clientePublico } = await import('./supabase');
  const c = clientePublico();
  if (!c) throw new Error('Supabase no está configurado.');
  return c;
}

/**
 * @param {string} q
 * @param {number} [limite]
 * @returns {Promise<Resultado[]>}
 */
export async function buscar(q, limite = 20) {
  const termino = q.trim();
  if (!termino) return [];
  const { data, error } = await (await cliente()).rpc('buscar_contenido', { q: termino, limite });
  if (error) throw error;
  return data ?? [];
}

/** @returns {Promise<{ name: string, slug: string }[]>} */
export async function etiquetasPopulares(limite = 6) {
  const { data, error } = await (await cliente()).rpc('etiquetas_populares', { limite });
  if (error) throw error;
  return data ?? [];
}

/**
 * Divide un fragmento de ts_headline en trozos de texto y coincidencias. La base marca las
 * coincidencias con [[ y ]] (§6.4): aquí se convierten en <mark> como elementos, nunca como HTML.
 * @param {string} fragmento
 * @returns {{ texto: string, marcado: boolean }[]}
 */
export function trozosDeFragmento(fragmento) {
  const trozos = [];
  const patron = /\[\[(.*?)\]\]/gs;
  let ultimo = 0;
  for (const m of (fragmento ?? '').matchAll(patron)) {
    if (m.index > ultimo) trozos.push({ texto: fragmento.slice(ultimo, m.index), marcado: false });
    trozos.push({ texto: m[1], marcado: true });
    ultimo = m.index + m[0].length;
  }
  if (ultimo < (fragmento ?? '').length)
    trozos.push({ texto: fragmento.slice(ultimo), marcado: false });
  return trozos;
}

/** Ruta interna o URL externa de un resultado. */
export function destinoDe(r) {
  return r.tipo === 'lectura' ? r.url : `/publicaciones/${r.slug}/`;
}
