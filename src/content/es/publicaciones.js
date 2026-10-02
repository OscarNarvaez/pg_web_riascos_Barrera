/**
 * Textos de interfaz de publicaciones, lecturas y buscador (especificación §5.5, §5.6 y A.8).
 */
export const textosPublicaciones = {
  titulo: 'Publicaciones',
  // Descripción de la ruta en §4.1.
  entradilla: 'Artículos y casos de la firma.',
  todas: 'Todas',
  etiquetas: 'Etiquetas',
  filtros: 'Filtrar publicaciones',
  sinPublicaciones: 'Aún no hay publicaciones.',
  articulo: 'Artículo',
  minutosDeLectura: (n) => `${n} min de lectura`,
  por: 'Por',
  paginacion: 'Páginas del listado',
  pagina: (n, total) => `Página ${n} de ${total}`,
  paginaN: (n) => `Página ${n}`,
  anterior: 'Anterior',
  siguiente: 'Siguiente',
  relacionadas: 'Publicaciones relacionadas',
  compartir: 'Compartir',
  compartirEn: (red) => `Compartir en ${red}`,
  copiarEnlace: 'Copiar enlace',
  enlaceCopiado: 'Enlace copiado',
  // Aviso obligatorio de los casos (§5.5 y A.8). También va en el encabezado del listado de
  // casos, por decisión del cliente.
  avisoCasos:
    'Cada asunto es distinto. La experiencia en casos anteriores no garantiza resultados en casos futuros.',
  etiquetaTitulo: (nombre) => `Publicaciones sobre ${nombre}`,
  redireccion: 'Esta publicación cambió de dirección.',
  irALaNueva: 'Ir a la publicación',
};

export const textosLecturas = {
  titulo: 'Lecturas recomendadas',
  sinLecturas: 'Aún no hay lecturas recomendadas.',
  leerEnLaFuente: (fuente) => `Leer en ${fuente}`,
  abreEnOtraPestana: '(se abre en otra pestaña)',
};

export const textosBuscador = {
  titulo: 'Buscar',
  campo: 'Qué desea buscar',
  ejemplo: 'Por ejemplo: contratación estatal',
  enviar: 'Buscar',
  cerrar: 'Cerrar el buscador',
  buscando: 'Buscando…',
  resultados: (n) => (n === 1 ? '1 resultado' : `${n} resultados`),
  verTodos: 'Ver todos los resultados',
  temasSugeridos: 'Temas',
  lectura: 'Lectura recomendada',
  // Anexo A.8.
  sinResultados: (termino) => `No encontramos publicaciones con "${termino}".`,
  sinResultadosAyuda: 'Pruebe con otra palabra o explore estos temas:',
  // Si aún no hay etiquetas con contenido, no se ofrecen temas.
  sinResultadosAyudaSinTemas: 'Pruebe con otra palabra.',
  sinResultadosContacto: 'Escríbanos',
  error: 'No pudimos completar la búsqueda. Revise su conexión e inténtelo de nuevo.',
};
