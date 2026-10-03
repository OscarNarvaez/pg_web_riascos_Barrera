/**
 * Configuración del panel de administración (especificación §7).
 *
 * Con exportación estática no hay rutas dinámicas que dependan de datos creados después de
 * compilar: cada módulo es una ruta fija y el registro concreto viaja en la consulta (?id=).
 */
import { panel } from '@/content/es/panel';

export const rutasPanel = {
  tablero: '/panel/',
  ingresar: '/panel/ingresar/',
  restablecer: '/panel/restablecer/',
  publicaciones: '/panel/publicaciones/',
  editarPublicacion: '/panel/publicaciones/editar/',
  lecturas: '/panel/lecturas/',
  editarLectura: '/panel/lecturas/editar/',
  etiquetas: '/panel/etiquetas/',
  contactos: '/panel/contactos/',
  detalleContacto: '/panel/contactos/detalle/',
  referentes: '/panel/referentes/',
  usuarios: '/panel/usuarios/',
};

/** Módulos del menú (§7.2). Los de administrador se ocultan al editor; RLS los protege. */
export const navegacionPanel = [
  { href: rutasPanel.tablero, etiqueta: panel.secciones.tablero },
  { href: rutasPanel.publicaciones, etiqueta: panel.secciones.publicaciones },
  { href: rutasPanel.lecturas, etiqueta: panel.secciones.lecturas },
  { href: rutasPanel.etiquetas, etiqueta: panel.secciones.etiquetas },
  { href: rutasPanel.contactos, etiqueta: panel.secciones.contactos, soloAdmin: true },
  { href: rutasPanel.referentes, etiqueta: panel.secciones.referentes, soloAdmin: true },
  { href: rutasPanel.usuarios, etiqueta: panel.secciones.usuarios, soloAdmin: true },
];

/**
 * El panel pide recompilar el sitio al cambiar contenido visible (§3.5). Cuando exista el webhook
 * de la base de datos (Fase 5), él lo hará en cada cambio y esta bandera pasará a false; el botón
 * "Actualizar el sitio ahora" sigue disponible en ambos casos.
 */
export const RECOMPILAR_DESDE_PANEL = true;

/** Máximo de contactos que carga el listado; los filtros se aplican en la base. */
export const LIMITE_CONTACTOS = 1000;
