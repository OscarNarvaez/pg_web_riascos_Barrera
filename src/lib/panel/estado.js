/**
 * Estado visible de una publicación o lectura en el panel, a partir de status, published_at y
 * deleted_at (§6.2 y §3.5). Es el mismo criterio de visibilidad que aplica RLS al público.
 *
 * @param {{ status: string, published_at: string | null, deleted_at?: string | null }} item
 * @param {Date} [ahora]
 * @returns {'papelera' | 'borrador' | 'programada' | 'publicada'}
 */
export function estadoDe(item, ahora = new Date()) {
  if (item.deleted_at) return 'papelera';
  if (item.status !== 'publicado' || !item.published_at) return 'borrador';
  return new Date(item.published_at) > ahora ? 'programada' : 'publicada';
}

/**
 * ¿Un cambio en este contenido se ve en el sitio público? Sí, si era visible antes o lo es
 * después. Decide si el panel pide recompilar el sitio (§3.5). Una publicación programada no
 * cambia el sitio hoy: aparece en la primera compilación posterior a su fecha.
 *
 * @param {Parameters<typeof estadoDe>[0] | null} antes
 * @param {Parameters<typeof estadoDe>[0]} despues
 * @param {Date} [ahora]
 */
export function afectaAlSitio(antes, despues, ahora = new Date()) {
  const visible = (x) => Boolean(x) && estadoDe(x, ahora) === 'publicada';
  return visible(antes) || visible(despues);
}
