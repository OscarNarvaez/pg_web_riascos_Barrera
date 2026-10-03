/**
 * Fechas del panel en hora de Bogotá. Colombia no tiene horario de verano desde 1993: su
 * desfase es siempre UTC−5. Así, una publicación programada para las 8:00 sale a las 8:00 de
 * Bogotá aunque quien la programe esté en otro huso horario.
 */

const DESFASE_MS = -5 * 60 * 60 * 1000;

const FORMATO = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'America/Bogota',
});

const FORMATO_DIA = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeZone: 'America/Bogota',
});

/**
 * Valor para un <input type="datetime-local"> en hora de Bogotá.
 * @param {string | null | undefined} iso
 */
export function aEntradaBogota(iso) {
  if (!iso) return '';
  const fecha = new Date(iso);
  if (Number.isNaN(fecha.getTime())) return '';
  return new Date(fecha.getTime() + DESFASE_MS).toISOString().slice(0, 16);
}

/**
 * Convierte el valor de un <input type="datetime-local"> (hora de Bogotá) a ISO.
 * @param {string} valor "AAAA-MM-DDTHH:MM"
 * @returns {string | null}
 */
export function deEntradaBogota(valor) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(valor ?? '')) return null;
  const fecha = new Date(`${valor}:00-05:00`);
  return Number.isNaN(fecha.getTime()) ? null : fecha.toISOString();
}

/**
 * Inicio del día (00:00 de Bogotá) de un valor "AAAA-MM-DD", en ISO. Con `fin`, el instante
 * anterior al día siguiente, para filtros "hasta" inclusivos.
 * @param {string} dia
 * @param {{ fin?: boolean }} [opciones]
 */
export function limiteDelDia(dia, { fin = false } = {}) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dia ?? '')) return null;
  const inicio = new Date(`${dia}T00:00:00-05:00`);
  if (Number.isNaN(inicio.getTime())) return null;
  return new Date(inicio.getTime() + (fin ? 24 * 60 * 60 * 1000 - 1 : 0)).toISOString();
}

/** @param {string | null | undefined} iso */
export function formatearFechaHora(iso) {
  return iso ? FORMATO.format(new Date(iso)) : '';
}

/** @param {string | null | undefined} iso */
export function formatearDia(iso) {
  return iso ? FORMATO_DIA.format(new Date(iso)) : '';
}
