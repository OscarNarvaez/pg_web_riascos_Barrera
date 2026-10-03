/**
 * Traduce los errores de Supabase (PostgREST, Auth, Storage) a códigos del panel. Los textos de
 * cada código viven en src/content/es/panel.js: el panel dice qué pasó y qué hacer (§5.9).
 *
 * @param {any} error
 * @returns {string | null}
 */
export function codigoDeError(error) {
  if (!error) return null;
  const mensaje = String(error.message ?? '');
  if (error.name === 'TypeError' || /failed to fetch|networkerror|load failed/i.test(mensaje)) {
    return 'red';
  }
  if (error.code === '23505') {
    if (error.hint === 'slug_anterior_de_otra') return 'slug_redirige_a_otra';
    if (/slug/.test(mensaje)) return 'slug_duplicado';
    if (/code/.test(mensaje)) return 'codigo_duplicado';
    return 'duplicado';
  }
  if (error.code === '23514') {
    if (error.hint === 'ultimo_admin') return 'ultimo_admin';
    if (/caso_publicado_anonimizado/.test(mensaje)) return 'caso_sin_anonimizar';
    if (/portada_con_texto_alternativo/.test(mensaje)) return 'portada_sin_alt';
    if (/no_reservado/.test(mensaje)) return 'slug_reservado';
    return 'restriccion';
  }
  // Identificador con formato inválido (por ejemplo, un ?id= alterado a mano).
  if (error.code === '22P02' || error.code === 'PGRST116') return 'no_encontrado';
  if (error.code === '42501' || error.code === 'PGRST301' || error.status === 403) {
    return 'sin_permiso';
  }
  if (error.status === 401 || /jwt expired|invalid jwt/i.test(mensaje)) return 'sesion_vencida';
  return 'desconocido';
}

/**
 * Errores de inicio de sesión y de contraseña de Supabase Auth.
 * @param {any} error
 */
export function codigoDeErrorAuth(error) {
  if (!error) return null;
  const codigo = String(error.code ?? '');
  const mensaje = String(error.message ?? '').toLowerCase();
  if (codigo === 'invalid_credentials' || mensaje.includes('invalid login credentials')) {
    return 'credenciales';
  }
  if (codigo === 'weak_password' || mensaje.includes('weak password')) return 'contrasena_debil';
  if (codigo === 'same_password') return 'contrasena_igual';
  if (codigo === 'otp_expired' || mensaje.includes('expired') || mensaje.includes('invalid')) {
    return 'enlace_vencido';
  }
  if (codigo.includes('rate_limit') || error.status === 429) return 'demasiados_intentos';
  if (error.name === 'AuthRetryableFetchError' || mensaje.includes('fetch')) return 'red';
  return 'desconocido';
}
