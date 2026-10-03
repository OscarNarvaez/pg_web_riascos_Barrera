/**
 * Validación de los formularios del panel. Devuelve códigos por campo; los textos viven en
 * src/content/es/panel.js. La base de datos repite las reglas críticas con restricciones (§6.2):
 * esto es para avisar a tiempo y con claridad, no la única barrera.
 */
import { errorDeSlug } from './texto';

export const LIMITES = {
  titulo: 200,
  extracto: 300,
  comentario: 500,
  // Recomendaciones de Google, no límites duros: el contador avisa al pasarlos.
  metaTitulo: 60,
  metaDescripcion: 160,
  nombre: 120,
  codigo: 32,
};

const PATRON_CORREO = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** @param {Record<string, string | null | undefined>} errores */
function limpiar(errores) {
  return Object.fromEntries(Object.entries(errores).filter(([, v]) => v));
}

/** @param {string} correo */
export function errorDeCorreo(correo) {
  if (!correo?.trim()) return 'obligatorio';
  return PATRON_CORREO.test(correo.trim()) ? null : 'correo_invalido';
}

/**
 * Solo enlaces web completos (http o https).
 * @param {string} url
 */
export function errorDeUrl(url) {
  if (!url?.trim()) return 'obligatorio';
  try {
    const u = new URL(url.trim());
    return /^https?:$/.test(u.protocol) && u.hostname.includes('.') ? null : 'url_invalida';
  } catch {
    return 'url_invalida';
  }
}

/**
 * Contraseña robusta (§13), con las mismas reglas que Supabase Auth (supabase/config.toml).
 * @param {string} clave
 * @param {string} confirmacion
 */
export function erroresDeContrasena(clave, confirmacion) {
  let error = null;
  if (!clave) error = 'obligatorio';
  else if (clave.length < 12) error = 'contrasena_corta';
  else if (!/[a-z]/.test(clave) || !/[A-Z]/.test(clave) || !/\d/.test(clave)) {
    error = 'contrasena_debil';
  }
  return limpiar({
    clave: error,
    confirmacion: !error && clave !== confirmacion ? 'contrasenas_distintas' : null,
  });
}

/**
 * Imágenes del cuerpo sin texto alternativo (§7.2: es obligatorio).
 * @param {string} html
 */
export function imagenesSinTextoAlternativo(html) {
  if (!html?.includes('<img')) return 0;
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return [...doc.querySelectorAll('img')].filter((img) => !img.getAttribute('alt')?.trim()).length;
}

/**
 * @param {{
 *   tipo: string, titulo: string, slug: string, extracto: string, portada: string | null,
 *   portadaAlt: string, html: string, texto: string, anonimizado: boolean,
 *   fecha: string | null, fechaInvalida?: boolean
 * }} p
 * @param {{ publicar?: boolean }} [opciones] Publicar exige además cuerpo, caso anonimizado y
 *   fecha válida.
 */
export function validarPublicacion(p, { publicar = false } = {}) {
  return limpiar({
    titulo: !p.titulo.trim()
      ? 'obligatorio'
      : p.titulo.length > LIMITES.titulo
        ? 'demasiado_largo'
        : null,
    slug: errorDeSlug(p.slug, { reservados: true }),
    extracto: p.extracto.length > LIMITES.extracto ? 'demasiado_largo' : null,
    portadaAlt: p.portada && !p.portadaAlt.trim() ? 'alt_obligatorio' : null,
    cuerpo:
      imagenesSinTextoAlternativo(p.html) > 0
        ? 'imagen_sin_alt'
        : publicar && !p.texto.trim()
          ? 'cuerpo_vacio'
          : null,
    anonimizado: publicar && p.tipo === 'caso' && !p.anonimizado ? 'caso_sin_anonimizar' : null,
    fecha: publicar && p.fechaInvalida ? 'fecha_invalida' : null,
  });
}

/**
 * @param {{ titulo: string, fuente: string, url: string, comentario: string, fechaInvalida?: boolean }} l
 * @param {{ publicar?: boolean }} [opciones]
 */
export function validarLectura(l, { publicar = false } = {}) {
  return limpiar({
    titulo: l.titulo.trim() ? null : 'obligatorio',
    fuente: l.fuente.trim() ? null : 'obligatorio',
    url: errorDeUrl(l.url),
    comentario: l.comentario.length > LIMITES.comentario ? 'demasiado_largo' : null,
    fecha: publicar && l.fechaInvalida ? 'fecha_invalida' : null,
  });
}

/** @param {{ nombre: string, slug: string }} e */
export function validarEtiqueta(e) {
  return limpiar({
    nombre: e.nombre.trim() ? null : 'obligatorio',
    slug: errorDeSlug(e.slug),
  });
}

/** @param {{ nombre: string, codigo: string }} r */
export function validarReferente(r) {
  return limpiar({
    nombre: r.nombre.trim() ? null : 'obligatorio',
    codigo: !r.codigo
      ? 'obligatorio'
      : !/^[A-Z0-9]+$/.test(r.codigo) || r.codigo.length > LIMITES.codigo
        ? 'codigo_invalido'
        : null,
  });
}

/** @param {{ email: string, nombre: string, cargo: string, rol: string }} u */
export function validarInvitacion(u) {
  return limpiar({
    email: errorDeCorreo(u.email),
    nombre: !u.nombre.trim()
      ? 'obligatorio'
      : u.nombre.length > LIMITES.nombre
        ? 'demasiado_largo'
        : null,
    cargo: u.cargo.length > LIMITES.nombre ? 'demasiado_largo' : null,
    rol: ['editor', 'admin'].includes(u.rol) ? null : 'rol_invalido',
  });
}
