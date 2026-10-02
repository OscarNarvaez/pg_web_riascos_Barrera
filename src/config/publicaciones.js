/** Configuración de las publicaciones (especificación §5.5). */

/** Publicaciones por página del listado. */
export const POR_PAGINA = 9;

/** Máximo de publicaciones relacionadas por etiquetas compartidas. */
export const MAX_RELACIONADAS = 3;

/** Publicaciones recientes en el Inicio (§5.1). */
export const RECIENTES_EN_INICIO = 3;

/**
 * Slugs reservados por las rutas del listado (§4.1). La base de datos los rechaza con una
 * restricción; aquí se usan para no confundir rutas en el navegador.
 */
export const SLUGS_RESERVADOS = ['casos', 'pagina', 'etiqueta'];

/**
 * Convención de portadas (§7.3): el panel sube dos variantes WebP con el mismo nombre base y
 * guarda en cover_path la de 1600 px. La de 800 px se deriva cambiando el sufijo.
 */
export const VARIANTES_PORTADA = { grande: '-1600.webp', mediana: '-800.webp' };

/**
 * Valor de reserva para rutas dinámicas sin datos. Con output: 'export', Next exige generar al
 * menos una ruta por página dinámica aunque no haya publicaciones. El guion bajo nunca aparece en
 * un slug real (la base solo admite [a-z0-9-]); scripts/finalizar.mjs borra estas rutas de out/
 * para que respondan con el 404 real y no con un 404 blando.
 */
export const RESERVA = '_reserva';
