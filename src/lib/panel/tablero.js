/**
 * Agregados del tablero (§7.2): contactos de los últimos 30 días por origen, referente y
 * campaña. El volumen de contactos de una firma boutique permite agrupar en el navegador.
 */

export const DIAS_DEL_TABLERO = 30;

/**
 * Cuenta las filas por el valor de una clave, de mayor a menor. Los valores vacíos se agrupan
 * bajo `null`.
 *
 * @template T
 * @param {T[]} filas
 * @param {(fila: T) => string | null | undefined} clave
 * @returns {{ valor: string | null, total: number }[]}
 */
export function contarPor(filas, clave) {
  const totales = new Map();
  for (const fila of filas) {
    const valor = clave(fila)?.trim() || null;
    totales.set(valor, (totales.get(valor) ?? 0) + 1);
  }
  return [...totales]
    .map(([valor, total]) => ({ valor, total }))
    .sort((a, b) => b.total - a.total || String(a.valor).localeCompare(String(b.valor), 'es'));
}

/** Fecha ISO de hace `dias` días. */
export function haceDias(dias, ahora = new Date()) {
  return new Date(ahora.getTime() - dias * 24 * 60 * 60 * 1000).toISOString();
}
