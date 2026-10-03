/**
 * Imágenes del panel (especificación §6.5 y §7.3). El plan gratuito de Supabase no transforma
 * imágenes: el navegador valida el archivo, elimina sus metadatos, lo convierte a WebP y genera
 * las variantes antes de subirlas.
 *
 * Los metadatos (EXIF, ubicación GPS, cámara) se eliminan al redibujar la imagen en un lienzo:
 * el WebP resultante solo contiene los píxeles.
 */
export const TIPOS_ACEPTADOS = ['image/jpeg', 'image/png', 'image/webp'];
export const TAMANO_MAXIMO = 10 * 1024 * 1024;
export const BUCKET = 'publicaciones';

/** Anchos de las variantes de una portada (§7.3) y de una imagen dentro del cuerpo. */
export const ANCHOS_PORTADA = [1600, 800];
export const ANCHOS_CUERPO = [1600];

const CALIDAD = 0.82;

/**
 * @param {File | null | undefined} archivo
 * @returns {'obligatorio' | 'tipo_no_admitido' | 'archivo_grande' | null}
 */
export function errorDeArchivo(archivo) {
  if (!archivo) return 'obligatorio';
  if (!TIPOS_ACEPTADOS.includes(archivo.type)) return 'tipo_no_admitido';
  if (archivo.size > TAMANO_MAXIMO) return 'archivo_grande';
  return null;
}

/**
 * Medidas de una variante: nunca se amplía una imagen más pequeña que el ancho pedido.
 * @param {number} ancho
 * @param {number} alto
 * @param {number} maximo
 */
export function medidasDestino(ancho, alto, maximo) {
  if (ancho <= maximo) return { ancho, alto };
  return { ancho: maximo, alto: Math.max(1, Math.round((alto * maximo) / ancho)) };
}

/**
 * Nombre único de una imagen en el bucket, agrupado por año: "2026/{uuid}". Cada variante añade
 * su ancho como sufijo ("-1600.webp", "-800.webp"): es la convención VARIANTES_PORTADA que usa
 * la compilación para derivar la variante mediana (§7.3).
 */
export function nombreBase(ahora = new Date()) {
  return `${ahora.getUTCFullYear()}/${crypto.randomUUID()}`;
}

/**
 * Codifica un lienzo en WebP. Chrome, Edge y Firefox lo hacen de forma nativa; Safari devuelve
 * PNG en su lugar, y entonces se usa un codificador WebAssembly que solo se descarga en ese caso.
 * @param {HTMLCanvasElement} lienzo
 */
async function codificarWebp(lienzo) {
  const nativo = await new Promise((resolver) => lienzo.toBlob(resolver, 'image/webp', CALIDAD));
  if (nativo?.type === 'image/webp') return nativo;
  const { encode } = await import('@jsquash/webp');
  const contexto = /** @type {CanvasRenderingContext2D} */ (lienzo.getContext('2d'));
  const pixeles = contexto.getImageData(0, 0, lienzo.width, lienzo.height);
  return new Blob([await encode(pixeles, { quality: CALIDAD * 100 })], { type: 'image/webp' });
}

/**
 * Convierte un archivo en una variante WebP por cada ancho pedido.
 * @param {File} archivo
 * @param {number[]} anchos
 * @returns {Promise<{ maximo: number, ancho: number, alto: number, blob: Blob }[]>}
 */
export async function convertirAWebp(archivo, anchos) {
  const mapa = await createImageBitmap(archivo, { imageOrientation: 'from-image' });
  try {
    const variantes = [];
    for (const maximo of anchos) {
      const { ancho, alto } = medidasDestino(mapa.width, mapa.height, maximo);
      const lienzo = document.createElement('canvas');
      lienzo.width = ancho;
      lienzo.height = alto;
      const contexto = /** @type {CanvasRenderingContext2D} */ (lienzo.getContext('2d'));
      contexto.imageSmoothingQuality = 'high';
      contexto.drawImage(mapa, 0, 0, ancho, alto);
      variantes.push({ maximo, ancho, alto, blob: await codificarWebp(lienzo) });
    }
    return variantes;
  } finally {
    mapa.close();
  }
}

/**
 * Convierte y sube una imagen al bucket. Devuelve la ruta de la variante mayor, que es la que se
 * guarda (cover_path, o el src de una imagen del cuerpo).
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} cliente
 * @param {File} archivo
 * @param {number[]} anchos
 * @returns {Promise<{ ruta: string, ancho: number, alto: number }>}
 */
export async function subirImagen(cliente, archivo, anchos) {
  const variantes = await convertirAWebp(archivo, anchos);
  const base = nombreBase();
  const subidas = [];
  for (const v of variantes) {
    const ruta = `${base}-${v.maximo}.webp`;
    const { error } = await cliente.storage.from(BUCKET).upload(ruta, v.blob, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: false,
    });
    if (error) {
      // No deja variantes sueltas si una falla.
      if (subidas.length) await cliente.storage.from(BUCKET).remove(subidas);
      throw error;
    }
    subidas.push(ruta);
  }
  const mayor = variantes[0];
  return { ruta: subidas[0], ancho: mayor.ancho, alto: mayor.alto };
}
