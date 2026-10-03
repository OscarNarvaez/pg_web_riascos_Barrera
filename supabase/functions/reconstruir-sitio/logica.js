/**
 * Reglas de la función reconstruir-sitio (especificación §3.5 y §13). Módulo puro, probado con
 * Vitest.
 */
import { igualesSeguro } from '../_compartido/http.js';

/** Repositorio del sitio. Es público; no es un secreto. */
export const REPOSITORIO = 'OscarNarvaez/pg_web_riascos_Barrera';

/** Tipo de evento que escucha .github/workflows/desplegar.yml. */
export const EVENTO = 'contenido-actualizado';

/**
 * ¿La petición viene del webhook de la base de datos? Exige el secreto compartido en la cabecera
 * x-webhook-secret (§13). Sin secreto configurado, ninguna petición pasa por esta vía.
 *
 * @param {string | null} recibido
 * @param {string | undefined} esperado
 */
export function esWebhookAutorizado(recibido, esperado) {
  return Boolean(esperado) && igualesSeguro(recibido ?? '', esperado ?? '');
}

/**
 * Petición a la API de GitHub que dispara la compilación (repository_dispatch).
 * @param {string} token Token de granularidad fina, solo este repositorio, Contents: write.
 * @param {'panel' | 'webhook'} origen Queda en el registro de la ejecución de Actions.
 */
export function peticionDispatch(token, origen) {
  return {
    url: `https://api.github.com/repos/${REPOSITORIO}/dispatches`,
    init: {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'riascos-barrera-reconstruir-sitio',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event_type: EVENTO, client_payload: { origen } }),
    },
  };
}
