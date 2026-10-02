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
   * Cobertura (Anexo A.6 y §5.7). Criterio decidido por el cliente: regional con alcance
   * nacional. `departamentos` decide qué resalta el mapa (presencia prioritaria);
   * `alcanceNacional` son las líneas aprobadas del material institucional que lo acompañan.
   * Las dos versiones de A.6 siguen pudiendo representarse sin tocar plantillas.
   */
  cobertura: {
    departamentos: ['Nariño', 'Putumayo', 'Cauca'],
    alcanceNacional: ['Atención en todo el país.', 'Gestión remota total.'],
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

  /** Nombre visible de la sección de casos (§5.5). Decisión del cliente. */
  nombreSeccionCasos: 'Casos de éxito',

  /**
   * Página de Equipo activable (§5.4). Por defecto, activa. Por decisión del cliente arranca
   * solo con la ficha de Marcela Riascos Eraso.
   */
  equipoActivo: env('NEXT_PUBLIC_EQUIPO_ACTIVO', 'true') !== 'false',

  /** Integrantes que aparecen en Equipo, en orden. Sus datos están en src/content/es/equipo.js. */
  integrantesPublicados: ['marcela-riascos-eraso'],
};
