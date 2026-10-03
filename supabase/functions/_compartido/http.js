/**
 * Utilidades HTTP comunes de las Edge Functions. Módulo puro: sin APIs de Deno, para poder
 * probarlo con Vitest.
 *
 * Las funciones responden con códigos de error (`{ error: 'codigo' }`), no con frases: los
 * textos viven en el sitio (src/content/es/), que los traduce para la persona.
 */

/** Orígenes de desarrollo local admitidos además del sitio. */
const ORIGENES_LOCALES = ['http://localhost:3000'];

/**
 * Cabeceras CORS. Solo se refleja el origen si es el del sitio o el de desarrollo local. CORS no
 * es la barrera de seguridad (lo son la sesión y RLS), pero evita que otros sitios usen la
 * función desde el navegador de una persona con sesión iniciada.
 *
 * @param {string | null} origen Cabecera Origin de la petición.
 * @param {string} urlSitio SITE_URL, con o sin ruta base.
 */
export function cabecerasCors(origen, urlSitio) {
  const permitidos = [...ORIGENES_LOCALES];
  try {
    permitidos.push(new URL(urlSitio).origin);
  } catch {
    // Sin SITE_URL válida solo se admite el desarrollo local.
  }
  const cabeceras = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
  if (origen && permitidos.includes(origen)) {
    cabeceras['Access-Control-Allow-Origin'] = origen;
  }
  return cabeceras;
}

/**
 * @param {unknown} cuerpo
 * @param {number} estado
 * @param {Record<string, string>} cabeceras
 */
export function responder(cuerpo, estado, cabeceras = {}) {
  return new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { ...cabeceras, 'Content-Type': 'application/json; charset=utf-8' },
  });
}

/** Token de la cabecera Authorization, o cadena vacía. */
export function tokenDe(cabeceraAutorizacion) {
  return (cabeceraAutorizacion ?? '').replace(/^Bearer\s+/i, '').trim();
}

/**
 * Compara dos secretos en tiempo constante respecto de su contenido, para no revelar por la
 * duración de la respuesta cuántos caracteres coinciden.
 * @param {string} a
 * @param {string} b
 */
export function igualesSeguro(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || !a || !b) return false;
  let diferencia = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    diferencia |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diferencia === 0;
}
