/**
 * Rutas públicas (especificación §4.1), siempre con barra final por trailingSlash.
 * next/link añade la ruta base por su cuenta: aquí van sin ella.
 */
import { firma } from './firma';
import { interfaz } from '@/content/es/interfaz';

export const rutas = {
  inicio: '/',
  laFirma: '/la-firma/',
  areas: '/areas-de-practica/',
  equipo: '/equipo/',
  publicaciones: '/publicaciones/',
  lecturas: '/lecturas-recomendadas/',
  contacto: '/contacto/',
  consulta: '/contacto/#consulta',
  buscar: '/buscar/',
  privacidad: '/politica-de-privacidad/',
  tratamientoDatos: '/politica-de-tratamiento-de-datos/',
};

const { navegacion: n } = interfaz;

/** Navegación principal del encabezado (§4.3). Equipo solo si está activo (§5.4). */
export const navegacionPrincipal = [
  { href: rutas.laFirma, etiqueta: n.laFirma },
  { href: rutas.areas, etiqueta: n.areas },
  ...(firma.equipoActivo ? [{ href: rutas.equipo, etiqueta: n.equipo }] : []),
  { href: rutas.publicaciones, etiqueta: n.publicaciones },
  { href: rutas.contacto, etiqueta: n.contacto },
];
