/**
 * Textos del panel de administración (especificación §7). Trato de usted. Los errores dicen qué
 * pasó y qué hacer (§5.9): nunca se disculpan ni son vagos.
 */
import { LIMITES } from '@/lib/panel/validacion';

export const panel = {
  nombre: 'Panel de administración',
  verSitio: 'Ver el sitio',
  cerrarSesion: 'Cerrar sesión',
  navegacion: 'Secciones del panel',
  abrirMenu: 'Abrir el menú del panel',
  cerrarMenu: 'Cerrar el menú del panel',
  cargando: 'Cargando…',
  reintentar: 'Intentar de nuevo',
  guardando: 'Guardando…',
  guardar: 'Guardar',
  cancelar: 'Cancelar',
  cerrar: 'Cerrar',
  editar: 'Editar',
  eliminar: 'Eliminar',
  crear: 'Crear',
  copiar: 'Copiar',
  copiado: 'Copiado',
  todos: 'Todos',
  quitarFiltros: 'Quitar filtros',
  sinCoincidencias: 'Ningún elemento coincide con los filtros.',
  soloAdmin: 'Esta sección es solo para administradores.',
  si: 'Sí',
  no: 'No',
  roles: { admin: 'Administrador', editor: 'Editor' },
  secciones: {
    tablero: 'Tablero',
    publicaciones: 'Publicaciones',
    lecturas: 'Lecturas recomendadas',
    etiquetas: 'Etiquetas',
    contactos: 'Contactos',
    referentes: 'Referentes',
    usuarios: 'Usuarios',
  },
  estados: {
    borrador: 'Borrador',
    programada: 'Programada',
    publicada: 'Publicada',
    papelera: 'En la papelera',
  },
  contador: (n, max) => `${n} de ${max} caracteres`,
  revisarCampos: 'Revise los campos marcados.',
  cambiosGuardados: 'Cambios guardados.',
};

/** Errores de la base, de Auth y de las Edge Functions, por código (src/lib/panel/errores.js). */
export const errores = {
  red: 'No hay conexión con el servidor. Revise su conexión a internet e inténtelo de nuevo.',
  sin_permiso: 'Su cuenta no tiene permiso para esta acción.',
  sesion_vencida: 'Su sesión venció. Ingrese de nuevo.',
  sin_sesion: 'Su sesión venció. Ingrese de nuevo.',
  sin_autorizacion: 'Su sesión venció o su cuenta no tiene permiso para esta acción.',
  solo_admin: 'Solo un administrador puede hacer esto.',
  slug_duplicado: 'Esa dirección (slug) ya está en uso. Escriba otra.',
  slug_redirige_a_otra:
    'Esa dirección la usó antes otra publicación y hoy redirige a ella. Escriba otra.',
  slug_reservado: 'Las direcciones «casos», «pagina» y «etiqueta» las usa el sitio. Escriba otra.',
  codigo_duplicado: 'Ya existe un referente con ese código. Escriba otro.',
  duplicado: 'Ya existe un elemento con esos datos.',
  caso_sin_anonimizar: 'Para publicar un caso, confirme que está anonimizado.',
  portada_sin_alt: 'Describa la portada en su texto alternativo.',
  ultimo_admin:
    'Debe quedar al menos un administrador. Asigne ese rol a otra persona antes de cambiar este.',
  restriccion:
    'La base de datos rechazó el cambio porque algún dato no es válido. Revise el formulario.',
  no_encontrado: 'No encontramos este elemento. Es posible que se haya eliminado.',
  sin_configurar:
    'Falta configurar la conexión con GitHub que actualiza el sitio. Avise al desarrollador.',
  github_rechazo: 'GitHub rechazó la solicitud de actualización del sitio. Avise al desarrollador.',
  correo_existente: 'Ya existe una cuenta con ese correo.',
  correo_no_autorizado:
    'El correo de prueba de Supabase solo entrega a las direcciones del equipo del proyecto. Las invitaciones a otras direcciones funcionarán cuando se configure el correo del sitio.',
  limite_de_correos:
    'Se alcanzó el límite de correos por hora del servicio. Inténtelo de nuevo más tarde.',
  invitacion_fallida: 'No se pudo enviar la invitación. Inténtelo de nuevo.',
  perfil_no_actualizado:
    'La invitación se envió, pero no se guardaron el nombre, el cargo ni el rol. Edítelos en la lista de usuarios.',
  validacion: 'Revise los campos marcados.',
  credenciales: 'El correo o la contraseña no son correctos. Revíselos e inténtelo de nuevo.',
  demasiados_intentos:
    'Hubo demasiados intentos seguidos. Espere unos minutos e inténtelo de nuevo.',
  enlace_vencido: 'El enlace venció o ya se usó. Solicite uno nuevo.',
  contrasena_igual: 'La contraseña nueva debe ser distinta de la anterior.',
  desconocido:
    'No se pudo completar la acción. Inténtelo de nuevo; si el problema continúa, avise al desarrollador.',
};

/** Mensajes de validación por código (src/lib/panel/validacion.js). */
export const validacion = {
  obligatorio: 'Complete este campo.',
  demasiado_largo: 'El texto es demasiado largo. Acórtelo.',
  correo_invalido: 'Escriba un correo válido, por ejemplo nombre@empresa.com.',
  url_invalida: 'Escriba la dirección completa, por ejemplo https://www.ejemplo.com/articulo.',
  slug_invalido:
    'Use solo minúsculas sin tildes, números y guiones, por ejemplo contratacion-estatal.',
  slug_reservado: errores.slug_reservado,
  alt_obligatorio: 'Describa lo que muestra la imagen para quien no puede verla.',
  imagen_sin_alt:
    'Hay imágenes sin texto alternativo en el contenido. Selecciónelas y use «Texto alternativo».',
  cuerpo_vacio: 'Escriba el contenido antes de publicar.',
  caso_sin_anonimizar: 'Marque la confirmación de anonimización para publicar este caso.',
  fecha_invalida: 'Escriba la fecha y la hora completas.',
  codigo_invalido: 'Use solo letras mayúsculas sin tildes y números, sin espacios (máximo 32).',
  rol_invalido: 'Elija un rol.',
  contrasena_corta: 'Use al menos 12 caracteres.',
  contrasena_debil: 'Combine mayúsculas, minúsculas y números.',
  contrasenas_distintas: 'Las contraseñas no coinciden. Escríbala de nuevo.',
  tipo_no_admitido: 'Use una imagen JPEG, PNG o WebP.',
  archivo_grande: 'La imagen supera los 10 MB. Use una más liviana.',
};

/**
 * Mensaje de un campo: los límites de longitud dicen el máximo concreto.
 * @param {string | undefined} codigo
 * @param {keyof typeof LIMITES} [limite]
 */
export function mensajeCampo(codigo, limite) {
  if (!codigo) return undefined;
  if (codigo === 'demasiado_largo' && limite) {
    return `El texto es demasiado largo: use como máximo ${LIMITES[limite]} caracteres.`;
  }
  return validacion[codigo] ?? errores[codigo] ?? errores.desconocido;
}

export const ingreso = {
  titulo: 'Ingresar al panel',
  correo: 'Correo',
  contrasena: 'Contraseña',
  ingresar: 'Ingresar',
  ingresando: 'Ingresando…',
  olvido: '¿Olvidó su contraseña?',
  inactividad: 'Cerramos su sesión tras 60 minutos sin actividad. Ingrese de nuevo.',
  salida: 'Su sesión se cerró.',
  sinPerfil: 'Su cuenta no tiene acceso al panel. Pida a un administrador que la revise.',
};

export const restablecer = {
  tituloSolicitar: 'Restablecer la contraseña',
  textoSolicitar:
    'Escriba el correo de su cuenta y le enviaremos un enlace para definir una contraseña nueva.',
  enviarEnlace: 'Enviar enlace',
  enviando: 'Enviando…',
  enviado:
    'Si el correo corresponde a una cuenta del panel, recibirá un enlace en unos minutos. Revise también la carpeta de correo no deseado.',
  tituloDefinir: 'Defina su contraseña',
  textoDefinir: 'Use al menos 12 caracteres y combine mayúsculas, minúsculas y números.',
  nueva: 'Contraseña nueva',
  confirmar: 'Confirme la contraseña',
  guardar: 'Guardar contraseña',
  listo: 'Su contraseña quedó guardada.',
  irAlPanel: 'Ir al panel',
  volverIngreso: 'Volver al ingreso',
};

export const sitio = {
  titulo: 'Actualizar el sitio',
  texto: 'El sitio se vuelve a generar con el contenido publicado. El proceso tarda unos minutos.',
  boton: 'Actualizar el sitio ahora',
  solicitando: 'Solicitando…',
  solicitado: 'El sitio se está actualizando. Los cambios estarán visibles en unos minutos.',
  // Especificación §3.5.
  publicacionEnMinutos: 'Su publicación estará visible en el sitio en unos minutos.',
  cambiosEnMinutos: 'Los cambios estarán visibles en el sitio en unos minutos.',
  noAutomatico:
    'El cambio se guardó, pero el sitio no pudo actualizarse automáticamente. Use «Actualizar el sitio ahora».',
};

export const tablero = {
  titulo: 'Tablero',
  contactos: 'Contactos de los últimos 30 días',
  total: (n) => (n === 1 ? '1 contacto' : `${n} contactos`),
  porOrigen: 'Por cómo nos conocieron',
  porReferente: 'Por referente',
  porCampana: 'Por campaña',
  sinDato: 'Sin dato',
  sinReferente: 'Sin referente',
  sinCampana: 'Sin campaña',
  sinContactos: 'No hay contactos en los últimos 30 días.',
  verContactos: 'Ver los contactos',
  recientes: 'Publicaciones recientes',
  sinPublicaciones: 'Aún no hay publicaciones.',
  verPublicaciones: 'Ver todas las publicaciones',
};

export const publicaciones = {
  titulo: 'Publicaciones',
  nueva: 'Nueva publicación',
  buscar: 'Buscar por título',
  tipo: 'Tipo',
  estado: 'Estado',
  articulo: 'Artículo',
  caso: 'Caso',
  fecha: 'Fecha de publicación',
  actualizada: 'Última edición',
  verPapelera: 'Ver la papelera',
  verActivas: 'Ver las publicaciones',
  papelera: 'Papelera',
  vacia: 'Aún no hay publicaciones. Cree la primera.',
  papeleraVacia: 'La papelera está vacía.',
  restaurar: 'Restaurar',
  restaurada: 'La publicación volvió a la lista como borrador.',
  eliminarDefinitivo: 'Eliminar definitivamente',
  confirmarEliminar: (titulo) => `¿Eliminar definitivamente «${titulo}»?`,
  eliminarAviso: 'Esta acción no se puede deshacer.',
  // Editor.
  tituloNueva: 'Nueva publicación',
  tituloEditar: 'Editar publicación',
  volver: 'Volver a publicaciones',
  pestanas: 'Secciones del formulario',
  pestanaContenido: 'Contenido',
  pestanaSeo: 'SEO',
  campoTitulo: 'Título',
  slug: 'Dirección (slug)',
  slugAyuda: (url) => `La publicación se verá en ${url}`,
  slugCambio:
    'Si cambia la dirección de una publicación ya visible, la anterior redirige a la nueva.',
  extracto: 'Extracto',
  extractoAyuda: 'Resumen breve que aparece en el listado y en los resultados de búsqueda.',
  portada: 'Portada',
  portadaAyuda:
    'Opcional. JPEG, PNG o WebP de hasta 10 MB; se convierte a WebP. Sin portada se usa la portada tipográfica de la marca.',
  elegirImagen: 'Elegir imagen',
  cambiarImagen: 'Cambiar imagen',
  quitarImagen: 'Quitar la portada',
  procesandoImagen: 'Preparando y subiendo la imagen…',
  portadaAlt: 'Texto alternativo de la portada',
  altAyuda: 'Describa lo que muestra la imagen para quien no puede verla.',
  area: 'Área de práctica',
  sinArea: 'Ninguna',
  etiquetas: 'Etiquetas',
  sinEtiquetas: 'Aún no hay etiquetas. Créelas en la sección Etiquetas.',
  cuerpo: 'Contenido',
  // Especificación §7.2, texto literal.
  anonimizado: 'Confirmo que este caso está anonimizado y no revela la identidad del cliente',
  publicacion: 'Publicación',
  fechaCampo: 'Fecha y hora de publicación (hora de Colombia)',
  fechaAyuda:
    'Vacía, se publica de inmediato. Con una fecha futura, la publicación queda programada.',
  // Sin punto final: la hora en es-CO ya termina en "a. m." o "p. m.".
  publicadaEl: (fecha) => `Publicada el ${fecha}`,
  programadaPara: (fecha) => `Programada para el ${fecha}`,
  esBorrador: 'Es un borrador: no se ve en el sitio.',
  guardar: 'Guardar',
  guardarBorrador: 'Guardar borrador',
  publicar: 'Publicar',
  programar: 'Programar',
  despublicar: 'Despublicar',
  enviarPapelera: 'Enviar a la papelera',
  vistaPrevia: 'Vista previa',
  cerrarVistaPrevia: 'Cerrar la vista previa',
  vistaPreviaAviso: 'Vista previa: así se verá la publicación en el sitio.',
  confirmarPapelera: '¿Enviar esta publicación a la papelera?',
  papeleraAviso:
    'Dejará de verse en el sitio. Puede restaurarla desde la papelera cuando lo necesite.',
  confirmarDespublicar: '¿Despublicar esta publicación?',
  despublicarAviso: 'Dejará de verse en el sitio y volverá a ser un borrador.',
  noExiste: 'Esta publicación no existe o se eliminó definitivamente.',
  // SEO (§7.2).
  metaTitulo: 'Título para buscadores',
  metaTituloAyuda: 'Si lo deja vacío, se usa el título. Recomendado: hasta 60 caracteres.',
  metaDescripcion: 'Descripción para buscadores',
  metaDescripcionAyuda: 'Si la deja vacía, se usa el extracto. Recomendado: hasta 160 caracteres.',
  vistaGoogle: 'Así podría verse en Google',
  excede: 'Supera lo recomendado: Google podría cortarlo.',
};

export const editorTexto = {
  barra: 'Formato del texto',
  parrafo: 'Párrafo',
  titulo: 'Título',
  subtitulo: 'Subtítulo',
  negrita: 'Negrita',
  cursiva: 'Cursiva',
  lista: 'Lista',
  listaNumerada: 'Lista numerada',
  cita: 'Cita',
  enlace: 'Enlace',
  quitarEnlace: 'Quitar enlace',
  imagen: 'Imagen',
  textoAlternativo: 'Texto alternativo',
  deshacer: 'Deshacer',
  rehacer: 'Rehacer',
  dialogoEnlace: 'Enlace',
  urlEnlace: 'Dirección del enlace',
  aplicar: 'Aplicar',
  dialogoImagen: 'Insertar imagen',
  archivoImagen: 'Imagen',
  archivoAyuda: 'JPEG, PNG o WebP de hasta 10 MB. Se convierte a WebP de hasta 1600 px.',
  insertar: 'Insertar',
  dialogoAlt: 'Texto alternativo de la imagen',
  areaTexto: 'Contenido de la publicación',
};

export const lecturas = {
  titulo: 'Lecturas recomendadas',
  nueva: 'Nueva lectura',
  buscar: 'Buscar por título o fuente',
  vacia: 'Aún no hay lecturas recomendadas. Cree la primera.',
  tituloNueva: 'Nueva lectura recomendada',
  tituloEditar: 'Editar lectura recomendada',
  volver: 'Volver a lecturas',
  campoTitulo: 'Título del artículo',
  fuente: 'Fuente',
  fuenteAyuda: 'Medio o entidad que publica el artículo.',
  url: 'Enlace al artículo',
  comentario: 'Comentario de la firma',
  // Regla 9: solo un comentario breve, nunca el contenido del artículo externo.
  comentarioAyuda: 'Por qué recomienda esta lectura. No copie el contenido del artículo.',
  confirmarPapelera: '¿Enviar esta lectura a la papelera?',
  papeleraAviso: 'Dejará de verse en el sitio. Puede restaurarla desde la papelera.',
  confirmarDespublicar: '¿Despublicar esta lectura?',
  despublicarAviso: 'Dejará de verse en el sitio y volverá a ser un borrador.',
  noExiste: 'Esta lectura no existe o se eliminó definitivamente.',
  restaurada: 'La lectura volvió a la lista como borrador.',
};

export const etiquetas = {
  titulo: 'Etiquetas',
  nueva: 'Nueva etiqueta',
  tituloNueva: 'Nueva etiqueta',
  tituloEditar: 'Editar etiqueta',
  nombre: 'Nombre',
  slug: 'Dirección (slug)',
  slugAyuda: (url) => `Su página se verá en ${url}`,
  descripcion: 'Descripción',
  descripcionAyuda: 'Opcional.',
  usos: (p, l) =>
    `${p === 1 ? '1 publicación' : `${p} publicaciones`} · ${l === 1 ? '1 lectura' : `${l} lecturas`}`,
  vacia: 'Aún no hay etiquetas.',
  confirmarEliminar: (nombre) => `¿Eliminar la etiqueta «${nombre}»?`,
  enUso: (n) =>
    `Está asignada a ${n === 1 ? '1 contenido' : `${n} contenidos`}. Al eliminarla, se quitará de todos.`,
  entiendo: 'Entiendo que la etiqueta se quitará de esos contenidos.',
  sinUso: 'No está asignada a ningún contenido.',
};

export const contactos = {
  titulo: 'Contactos',
  desde: 'Desde',
  hasta: 'Hasta',
  formulario: 'Formulario',
  origen: 'Cómo nos conoció',
  referente: 'Referente',
  campana: 'Campaña',
  estado: 'Estado',
  estados: { nuevo: 'Nuevo', atendido: 'Atendido', descartado: 'Descartado' },
  exportar: 'Exportar a CSV',
  exportarAyuda: (n) =>
    n === 1 ? 'Exporta el contacto filtrado.' : `Exporta los ${n} contactos filtrados.`,
  vacia: 'Aún no se ha recibido ningún contacto.',
  limite: (n) => `Se muestran los ${n} contactos más recientes. Use los filtros para acotar.`,
  verDetalle: (nombre) => `Ver el contacto de ${nombre}`,
  // Detalle.
  tituloDetalle: 'Contacto',
  volver: 'Volver a contactos',
  datos: 'Datos de contacto',
  mensaje: 'Mensaje',
  atribucion: 'Origen',
  consentimiento: 'Consentimiento (Ley 1581 de 2012)',
  gestion: 'Seguimiento',
  notas: 'Notas internas',
  notasAyuda: 'Solo las ve el equipo en el panel.',
  noExiste: 'Este contacto no existe.',
  campos: {
    created_at: 'Fecha',
    form_type: 'Formulario',
    name: 'Nombre',
    email: 'Correo',
    phone: 'Teléfono',
    organization: 'Organización',
    client_type: 'Tipo de cliente',
    practice_area: 'Área de interés',
    message: 'Mensaje',
    how_found: 'Cómo nos conoció',
    referred_by: 'Quién lo recomendó',
    referral_code: 'Código de referente',
    utm_source: 'Fuente (utm_source)',
    utm_medium: 'Medio (utm_medium)',
    utm_campaign: 'Campaña (utm_campaign)',
    utm_term: 'Término (utm_term)',
    utm_content: 'Contenido (utm_content)',
    gclid: 'gclid',
    fbclid: 'fbclid',
    landing_page: 'Página de llegada',
    referrer_url: 'Página de procedencia',
    consent_accepted: 'Aceptó la política',
    consent_at: 'Fecha del consentimiento',
    consent_policy_version: 'Versión de la política',
    consent_ip: 'Dirección IP',
    consent_user_agent: 'Navegador',
    status: 'Estado',
    internal_notes: 'Notas internas',
  },
};

export const referentes = {
  titulo: 'Referentes',
  nuevo: 'Nuevo referente',
  tituloNuevo: 'Nuevo referente',
  tituloEditar: 'Editar referente',
  nombre: 'Nombre',
  codigo: 'Código',
  codigoAyuda: 'Letras mayúsculas y números, sin espacios. Aparece en el enlace.',
  activo: 'Activo',
  activoAyuda: 'Los contactos que lleguen con un código inactivo no lo registran.',
  inactivo: 'Inactivo',
  notas: 'Notas',
  notasAyuda: 'Opcional. Solo las ve el equipo en el panel.',
  enlace: 'Enlace para compartir',
  copiarEnlace: (nombre) => `Copiar el enlace de ${nombre}`,
  contactos: (n) => (n === 1 ? '1 contacto' : `${n} contactos`),
  vacia: 'Aún no hay referentes.',
  confirmarEliminar: (nombre) => `¿Eliminar el referente «${nombre}»?`,
  eliminarAviso:
    'Los contactos que llegaron con su código lo perderán. Si solo quiere dejar de usarlo, desactívelo.',
};

export const usuarios = {
  titulo: 'Usuarios',
  invitar: 'Invitar a una persona',
  tituloInvitar: 'Invitar a una persona',
  tituloEditar: 'Editar usuario',
  correo: 'Correo',
  nombre: 'Nombre completo',
  cargo: 'Cargo',
  cargoAyuda: 'Opcional. Aparece junto a su nombre en las publicaciones que firme.',
  rol: 'Rol',
  rolAyuda:
    'Editor: publicaciones, lecturas y etiquetas. Administrador: todo, más contactos, referentes y usuarios.',
  enviarInvitacion: 'Enviar invitación',
  enviando: 'Enviando…',
  invitacionEnviada: (correo) =>
    `Enviamos la invitación a ${correo}. El enlace para definir la contraseña vence en 24 horas.`,
  pendiente: 'Invitación pendiente',
  ultimoAcceso: 'Último acceso',
  nunca: 'Nunca',
  usted: '(usted)',
  sinNombre: 'Sin nombre',
  reenviar: 'Reenviar la invitación',
};
