/**
 * Cliente de Supabase con la clave pública (rol anon), en la compilación y en el navegador
 * (especificación §3.3). La seguridad la dan las políticas RLS; la clave secreta nunca sale de
 * las Edge Functions.
 */
import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const CLAVE = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const SUPABASE_CONFIGURADO = Boolean(URL && CLAVE);

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
let cliente = null;

/** Cliente sin sesión persistente: el sitio público no inicia sesión. */
export function clientePublico() {
  if (!SUPABASE_CONFIGURADO) return null;
  cliente ??= createClient(URL, CLAVE, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  return cliente;
}

/**
 * URL pública de un archivo del bucket "publicaciones" (§6.5).
 * @param {string | null | undefined} ruta
 */
export function urlPublica(ruta) {
  if (!ruta) return null;
  if (/^https?:\/\//.test(ruta)) return ruta;
  return `${URL}/storage/v1/object/public/publicaciones/${ruta.replace(/^\/+/, '')}`;
}
