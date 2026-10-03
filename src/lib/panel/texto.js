/**
 * Utilidades de texto del panel: slugs, códigos de referente y minutos de lectura.
 */
import { SLUGS_RESERVADOS } from '@/config/publicaciones';

const PATRON_SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/** Longitud máxima razonable de un slug: URL legible y sin cortes en los resultados de Google. */
export const MAX_SLUG = 80;

/**
 * Slug con transliteración de tildes y eñes (§6.2), igual que public.generar_slug() en la base:
 * "Contratación estatal: ¿Año?" → "contratacion-estatal-ano".
 * @param {string} texto
 */
export function generarSlug(texto) {
  const base = (texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (base.length <= MAX_SLUG) return base;
  // Corta en el último guion para no dejar una palabra a medias.
  const corto = base.slice(0, MAX_SLUG + 1);
  return corto.slice(0, corto.lastIndexOf('-')) || base.slice(0, MAX_SLUG);
}

/**
 * @param {string} slug
 * @param {{ reservados?: boolean }} [opciones] Con `reservados`, rechaza los slugs de las rutas
 *   del listado (§4.1). Solo aplica a publicaciones, no a etiquetas.
 * @returns {'obligatorio' | 'slug_invalido' | 'slug_reservado' | null}
 */
export function errorDeSlug(slug, { reservados = false } = {}) {
  if (!slug) return 'obligatorio';
  if (!PATRON_SLUG.test(slug) || slug.length > MAX_SLUG) return 'slug_invalido';
  if (reservados && SLUGS_RESERVADOS.includes(slug)) return 'slug_reservado';
  return null;
}

/**
 * Código de referente (§6.2): mayúsculas y números, sin espacios ni tildes.
 * @param {string} texto
 */
export function normalizarCodigo(texto) {
  return (texto ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '');
}

/** @param {string} texto */
export function contarPalabras(texto) {
  return (texto ?? '').trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Minutos de lectura a 200 palabras por minuto, como en la compilación (src/lib/contenido.js).
 * @param {string} texto
 */
export function minutosDeLectura(texto) {
  return Math.max(1, Math.round(contarPalabras(texto) / 200));
}

/**
 * Texto sin tildes, para búsquedas en el navegador insensibles a ellas.
 * @param {string} texto
 */
export function sinTildes(texto) {
  return (texto ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Quita los párrafos vacíos del final que añade el editor para poder seguir escribiendo después
 * de un título o una imagen: en el sitio solo sumarían espacio.
 * @param {string} html
 */
export function sinParrafosVaciosFinales(html) {
  return (html ?? '').replace(/(?:<p>(?:<br\s*\/?>)?<\/p>\s*)+$/, '');
}
