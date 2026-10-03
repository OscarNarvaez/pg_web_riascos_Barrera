import { RECOMPILAR_DESDE_PANEL } from '@/config/panel';
import { errores, panel, sitio } from '@/content/es/panel';
import { afectaAlSitio } from '@/lib/panel/estado';
import { recompilarSitio } from './ActualizarSitio';

/**
 * @typedef {{ tipo: 'exito' | 'error', texto: string, actualizar?: boolean }} AvisoGuardado
 */

/**
 * Pide la recompilación del sitio (§3.5) y devuelve el aviso para la persona. `actualizar`
 * indica que se ofrezca el botón "Actualizar el sitio ahora".
 *
 * @param {{ esPublicacion?: boolean }} [opciones]
 * @returns {Promise<AvisoGuardado>}
 */
export async function avisoRecompilando({ esPublicacion = false } = {}) {
  const enMinutos = esPublicacion ? sitio.publicacionEnMinutos : sitio.cambiosEnMinutos;
  if (!RECOMPILAR_DESDE_PANEL) return { tipo: 'exito', texto: enMinutos, actualizar: true };
  const codigo = await recompilarSitio();
  if (codigo) {
    return {
      tipo: 'error',
      texto: `${sitio.noAutomatico} ${errores[codigo] ?? errores.desconocido}`,
      actualizar: true,
    };
  }
  return { tipo: 'exito', texto: enMinutos, actualizar: true };
}

/**
 * Tras guardar un contenido: si el cambio toca lo que se ve en el sitio, pide la recompilación.
 *
 * @param {Parameters<typeof afectaAlSitio>[0]} antes
 * @param {Parameters<typeof afectaAlSitio>[1]} despues
 * @param {{ esPublicacion?: boolean }} [opciones]
 * @returns {Promise<AvisoGuardado>}
 */
export async function avisoTrasGuardar(antes, despues, opciones) {
  if (!afectaAlSitio(antes, despues)) return { tipo: 'exito', texto: panel.cambiosGuardados };
  return avisoRecompilando(opciones);
}

/**
 * Sincroniza las etiquetas de un contenido con la selección: quita las desmarcadas y añade las
 * nuevas.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} cliente
 * @param {'post_tags' | 'external_read_tags'} tabla
 * @param {'post_id' | 'external_read_id'} columna
 * @param {string} id
 * @param {string[]} anteriores
 * @param {string[]} seleccion
 */
export async function sincronizarEtiquetas(cliente, tabla, columna, id, anteriores, seleccion) {
  const quitar = anteriores.filter((t) => !seleccion.includes(t));
  const anadir = seleccion.filter((t) => !anteriores.includes(t));
  if (quitar.length) {
    const { error } = await cliente.from(tabla).delete().eq(columna, id).in('tag_id', quitar);
    if (error) throw error;
  }
  if (anadir.length) {
    const { error } = await cliente
      .from(tabla)
      .insert(anadir.map((tag_id) => ({ [columna]: id, tag_id })));
    if (error) throw error;
  }
}
