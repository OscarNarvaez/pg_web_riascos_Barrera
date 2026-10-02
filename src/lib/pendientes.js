/**
 * Marcadores de contenido pendiente (especificación §2.1 y §14.4).
 * Formato exacto: corchete, la palabra PENDIENTE, dos puntos, descripción y corchete de cierre.
 */

export const PATRON_PENDIENTE = /\[PENDIENTE(?::\s*([^\]]*))?\]/;

/**
 * @param {unknown} valor
 * @returns {boolean}
 */
export function esPendiente(valor) {
  return typeof valor === 'string' && PATRON_PENDIENTE.test(valor);
}

/**
 * Descripción de lo que falta, o null si el valor no es un marcador.
 * @param {unknown} valor
 */
export function descripcionPendiente(valor) {
  if (typeof valor !== 'string') return null;
  const coincidencia = valor.match(PATRON_PENDIENTE);
  return coincidencia ? (coincidencia[1] ?? '').trim() : null;
}

/**
 * Texto visible del marcador.
 * @param {string} descripcion
 */
export function formatearPendiente(descripcion) {
  return `[PENDIENTE: ${descripcion}]`;
}

/** En producción, los elementos con datos pendientes se ocultan. */
export const MOSTRAR_PENDIENTES = process.env.NODE_ENV !== 'production';
