/**
 * Cierre de sesión por inactividad tras 60 minutos (§7.1). Supabase solo ofrece ese límite en
 * planes de pago, así que lo aplica el panel. La última actividad se guarda en localStorage para
 * compartirla entre pestañas: trabajar en una mantiene viva la sesión en todas.
 */

export const LIMITE_INACTIVIDAD_MS = 60 * 60 * 1000;
const CLAVE = 'rb-panel-actividad';

/** @returns {number | null} */
export function leerActividad() {
  try {
    const valor = Number(localStorage.getItem(CLAVE));
    return Number.isFinite(valor) && valor > 0 ? valor : null;
  } catch {
    return null;
  }
}

export function registrarActividad(ahora = Date.now()) {
  try {
    localStorage.setItem(CLAVE, String(ahora));
  } catch {
    // Sin almacenamiento (ventana privada estricta), cuenta solo la actividad de esta pestaña.
  }
}

/**
 * @param {number | null} ultima
 * @param {number} [ahora]
 */
export function inactividadVencida(ultima, ahora = Date.now()) {
  return ultima !== null && ahora - ultima >= LIMITE_INACTIVIDAD_MS;
}
