import {
  areasDeInteres,
  comoNosConocio,
  etiquetaDe,
  tiposDeCliente,
  tiposDeFormulario,
} from '@/content/es/captacion';
import { contactos as t, panel } from '@/content/es/panel';
import { formatearFechaHora } from '@/lib/panel/fechas';

/**
 * Valor legible de cada campo de un contacto (§6.2), para el detalle y la exportación a CSV.
 * @type {Record<string, (c: any) => string>}
 */
export const legible = {
  created_at: (c) => formatearFechaHora(c.created_at),
  form_type: (c) => etiquetaDe(tiposDeFormulario, c.form_type),
  client_type: (c) => etiquetaDe(tiposDeCliente, c.client_type),
  practice_area: (c) => etiquetaDe(areasDeInteres, c.practice_area),
  how_found: (c) => etiquetaDe(comoNosConocio, c.how_found),
  consent_accepted: (c) => (c.consent_accepted ? panel.si : panel.no),
  consent_at: (c) => formatearFechaHora(c.consent_at),
  status: (c) => t.estados[c.status] ?? c.status,
};

/** @param {string} campo @param {any} contacto */
export function valorDe(campo, contacto) {
  return legible[campo]?.(contacto) ?? contacto[campo] ?? '';
}

/** Columnas del CSV: todos los campos, en el orden de la tabla leads. */
export const COLUMNAS_CSV = Object.keys(t.campos).map((campo) => ({
  titulo: t.campos[campo],
  valor: (c) => valorDe(campo, c),
}));

export const GRUPOS = {
  datos: [
    'created_at',
    'form_type',
    'name',
    'email',
    'phone',
    'organization',
    'client_type',
    'practice_area',
  ],
  atribucion: [
    'how_found',
    'referred_by',
    'referral_code',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'gclid',
    'fbclid',
    'landing_page',
    'referrer_url',
  ],
  consentimiento: [
    'consent_accepted',
    'consent_at',
    'consent_policy_version',
    'consent_ip',
    'consent_user_agent',
  ],
};
