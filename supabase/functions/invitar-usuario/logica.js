/**
 * Validación de una invitación al panel (especificación §7.2, módulo Usuarios). Módulo puro,
 * probado con Vitest. El navegador valida lo mismo, pero aquí está la fuente de verdad (§13).
 */

export const ROLES = ['editor', 'admin'];

const PATRON_CORREO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * @param {unknown} cuerpo `{ email, nombre, cargo?, rol }`
 * @returns {{ datos: { email: string, nombre: string, cargo: string | null, rol: string } }
 *   | { errores: Record<string, string> }} Los errores son códigos por campo.
 */
export function validarInvitacion(cuerpo) {
  const c = cuerpo && typeof cuerpo === 'object' ? cuerpo : {};
  const email = String(c.email ?? '')
    .trim()
    .toLowerCase();
  const nombre = String(c.nombre ?? '').trim();
  const cargo = String(c.cargo ?? '').trim();
  const rol = String(c.rol ?? '');

  const errores = {};
  if (!PATRON_CORREO.test(email) || email.length > 254) errores.email = 'correo_invalido';
  if (!nombre) errores.nombre = 'obligatorio';
  else if (nombre.length > 120) errores.nombre = 'demasiado_largo';
  if (cargo.length > 120) errores.cargo = 'demasiado_largo';
  if (!ROLES.includes(rol)) errores.rol = 'rol_invalido';

  if (Object.keys(errores).length) return { errores };
  return { datos: { email, nombre, cargo: cargo || null, rol } };
}

/**
 * Traduce un error de Supabase Auth al invitar en un código para el panel.
 * @param {{ code?: string, message?: string, status?: number }} error
 */
export function codigoErrorInvitacion(error) {
  const texto = `${error?.code ?? ''} ${error?.message ?? ''}`.toLowerCase();
  if (/email_exists|already been registered|already registered/.test(texto)) {
    return 'correo_existente';
  }
  // El remitente por defecto de Supabase solo entrega a direcciones del equipo del proyecto.
  if (/not authorized|email_address_not_authorized/.test(texto)) return 'correo_no_autorizado';
  if (/rate limit|over_email_send_rate_limit/.test(texto)) return 'limite_de_correos';
  return 'invitacion_fallida';
}
