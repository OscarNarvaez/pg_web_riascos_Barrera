/** Fechas en español de Colombia, con la hora de Bogotá. */
const FORMATO = new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeZone: 'America/Bogota' });

/** @param {string} iso */
export function formatearFecha(iso) {
  return iso ? FORMATO.format(new Date(iso)) : '';
}
