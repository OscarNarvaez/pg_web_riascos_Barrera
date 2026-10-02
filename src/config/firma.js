/**
 * Datos centrales de la firma (especificación §14.1).
 * Todo valor sale del Anexo A. Los datos sin confirmar usan el marcador PENDIENTE:
 * en desarrollo se ven resaltados y en producción el elemento que los usa se oculta (§14.4).
 * Los integrantes del equipo se añaden en la Fase 2.
 */

const env = (nombre, porDefecto) => process.env[nombre] ?? porDefecto;

export const firma = {
  nombre: 'Riascos & Barrera',
  descriptor: 'Abogados · Consultores',
  concepto: 'Inteligencia para decidir.',
  subtitulo: 'Estrategia jurídica para decisiones que importan.',
  posicionamiento: 'Boutique Legal Strategy · Público · Privado',
  promesa: 'Nunca prometemos resultados. Prometemos una forma de trabajar.',

  direccion: {
    edificio: 'Edificio Hito',
    oficina: 'Oficina 1103',
    calle: 'Carrera 37 N.º 19B-35',
    ciudad: 'Pasto',
    departamento: 'Nariño',
    pais: 'Colombia',
    codigoPais: 'CO',
    coordenadas: '[PENDIENTE: coordenadas del Edificio Hito para el mapa]',
  },

  contacto: {
    telefono: '[PENDIENTE: teléfono institucional]',
    correo: '[PENDIENTE: correo institucional]',
    // El botón de WhatsApp no se muestra si la variable está vacía (§8.6).
    whatsapp: env('NEXT_PUBLIC_WHATSAPP', ''),
    redes: '[PENDIENTE: redes sociales institucionales]',
  },

  /**
   * Cobertura (Anexo A.6). Las dos versiones deben poder representarse sin tocar plantillas.
   * `departamentos` decide qué resalta el mapa; por defecto, lo acordado el 30 de septiembre.
   */
  cobertura: {
    departamentos: ['Nariño', 'Putumayo', 'Cauca'],
    texto: '[PENDIENTE: confirmar texto de cobertura]',
    materialInstitucional: {
      sede: 'Pasto, Nariño',
      influenciaPrioritaria: ['Nariño', 'Putumayo'],
      puntosDeAtencion: ['Bogotá', 'Cali'],
      modeloDigital: 'Atención en todo el país.',
      audienciasVirtuales: 'Gestión remota total.',
      desplazamientos: 'Movilidad estratégica según la necesidad del caso.',
    },
  },

  /** Nombre visible de la sección de casos (§5.5). */
  nombreSeccionCasos: 'Casos',

  /** Página de Equipo activable (§5.4). Por defecto, activa. */
  equipoActivo: env('NEXT_PUBLIC_EQUIPO_ACTIVO', 'true') !== 'false',
};
