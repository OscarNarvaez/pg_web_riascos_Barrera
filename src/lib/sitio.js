/**
 * URL del sitio y ruta base (especificación §4.2).
 */

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(
  /\/$/,
  '',
);

/**
 * Mientras el sitio viva en github.io, todo lleva noindex (§10) para que Google no indexe
 * la URL temporal y no haya contenido duplicado al mudar al dominio propio.
 */
export const ES_URL_TEMPORAL = /\.github\.io(\/|$)/.test(SITE_URL);

export const INDEXABLE = !ES_URL_TEMPORAL && process.env.NODE_ENV === 'production';

/**
 * Antepone la ruta base a un recurso estático de public/.
 * next/link la añade solo; <img>, <source> y similares no.
 * @param {string} ruta Ruta absoluta dentro del sitio, por ejemplo "/logos/logo.webp".
 */
export function conBase(ruta) {
  return `${BASE_PATH}${ruta}`;
}
