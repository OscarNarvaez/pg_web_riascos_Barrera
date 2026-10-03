/**
 * Opciones de los formularios de captación (especificación §8.1 y §8.2). Las usan los
 * formularios (Fase 5) y el módulo de contactos del panel (§7.2). `valor` es lo que se guarda
 * en la tabla leads; `etiqueta`, lo que ve la persona.
 */
import { areas } from './areas';

export const comoNosConocio = [
  { valor: 'recomendacion', etiqueta: 'Recomendación de un cliente, colega o aliado' },
  { valor: 'google', etiqueta: 'Búsqueda en Google' },
  { valor: 'redes-sociales', etiqueta: 'Redes sociales' },
  { valor: 'publicidad-digital', etiqueta: 'Publicidad digital' },
  { valor: 'evento', etiqueta: 'Evento o conferencia' },
  { valor: 'pendon-qr', etiqueta: 'Pendón o código QR' },
  { valor: 'otro', etiqueta: 'Otro' },
];

export const tiposDeCliente = [
  { valor: 'entidad-publica', etiqueta: 'Entidad pública' },
  { valor: 'empresa-privada', etiqueta: 'Empresa privada' },
  { valor: 'contratista-estado', etiqueta: 'Contratista del Estado' },
  { valor: 'persona-natural', etiqueta: 'Persona natural' },
  { valor: 'otro', etiqueta: 'Otro' },
];

export const areasDeInteres = [
  ...areas.map((a) => ({ valor: a.ancla, etiqueta: a.nombre })),
  { valor: 'no-seguro', etiqueta: 'No estoy seguro' },
];

export const tiposDeFormulario = [
  { valor: 'contacto', etiqueta: 'Contacto general' },
  { valor: 'consulta', etiqueta: 'Solicitud de consulta' },
];

/**
 * Etiqueta visible de un valor guardado. Si el valor no está en la lista (por ejemplo, un dato
 * antiguo), se muestra tal cual.
 * @param {{ valor: string, etiqueta: string }[]} opciones
 * @param {string | null | undefined} valor
 */
export function etiquetaDe(opciones, valor) {
  if (!valor) return '';
  return opciones.find((o) => o.valor === valor)?.etiqueta ?? valor;
}
