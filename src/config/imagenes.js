/**
 * Inventario de espacios de imagen (Anexo B.2).
 * El nombre es el del archivo esperado en imagenes/originales/, sin extensión.
 * `proporcion` es [ancho, alto]; `minimo` es el original mínimo en píxeles.
 */

/** @typedef {{ proporcion: [number, number], minimo: [number, number], ubicacion: string }} EspacioImagen */

/** @type {Record<string, EspacioImagen>} */
export const espaciosDeImagen = {
  'inicio-hero': {
    proporcion: [16, 9],
    minimo: [2880, 1620],
    ubicacion: 'Inicio, hero (escritorio y tableta)',
  },
  'inicio-hero-movil': {
    proporcion: [4, 5],
    minimo: [1290, 1612],
    ubicacion: 'Inicio, hero (móvil)',
  },
  'inicio-que-hacemos': {
    proporcion: [4, 3],
    minimo: [2000, 1500],
    ubicacion: 'Inicio, "Qué hacemos"',
  },
  'inicio-cierre': { proporcion: [21, 9], minimo: [2880, 1234], ubicacion: 'Inicio, cierre' },
  'firma-portada': { proporcion: [21, 9], minimo: [2880, 1234], ubicacion: 'La Firma, encabezado' },
  'firma-oficina-01': { proporcion: [4, 3], minimo: [2000, 1500], ubicacion: 'La Firma, galería' },
  'firma-oficina-02': { proporcion: [4, 3], minimo: [2000, 1500], ubicacion: 'La Firma, galería' },
  'area-derecho-publico': {
    proporcion: [4, 3],
    minimo: [2000, 1500],
    ubicacion: 'Áreas de Práctica',
  },
  'area-litigio-administrativo': {
    proporcion: [4, 3],
    minimo: [2000, 1500],
    ubicacion: 'Áreas de Práctica',
  },
  'area-derecho-laboral': {
    proporcion: [4, 3],
    minimo: [2000, 1500],
    ubicacion: 'Áreas de Práctica',
  },
  'area-derecho-privado': {
    proporcion: [4, 3],
    minimo: [2000, 1500],
    ubicacion: 'Áreas de Práctica',
  },
  'equipo-grupal': { proporcion: [16, 9], minimo: [2880, 1620], ubicacion: 'Equipo, encabezado' },
  'equipo-marcela-riascos-eraso': {
    proporcion: [4, 5],
    minimo: [1600, 2000],
    ubicacion: 'Equipo e Inicio',
  },
  'equipo-jose-camilo-guzman-santos': {
    proporcion: [4, 5],
    minimo: [1600, 2000],
    ubicacion: 'Equipo',
  },
  'equipo-diego-moreno-montenegro': {
    proporcion: [4, 5],
    minimo: [1600, 2000],
    ubicacion: 'Equipo',
  },
  'equipo-diana-maldonado': { proporcion: [4, 5], minimo: [1600, 2000], ubicacion: 'Equipo' },
  'contacto-edificio-hito': {
    proporcion: [4, 3],
    minimo: [2000, 1500],
    ubicacion: 'Contacto, fachada del mapa',
  },
  'social-compartir': {
    proporcion: [1.91, 1],
    minimo: [1200, 630],
    ubicacion: 'Vista previa al compartir',
  },
};

/** Anchos que genera el optimizador (§11). */
export const ANCHOS_IMAGEN = [640, 1024, 1600, 2400];
