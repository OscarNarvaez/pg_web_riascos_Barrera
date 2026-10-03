/**
 * Cliente de Supabase del panel (§7.1): con sesión persistente y renovación automática del token.
 * Usa la clave pública: lo que cada persona puede hacer lo deciden su rol y las políticas RLS,
 * nunca este código. El sitio público no lo importa.
 */
import { createClient } from '@supabase/supabase-js';

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const CLAVE = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
let cliente = null;

export function clientePanel() {
  cliente ??= createClient(URL_SUPABASE, CLAVE, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Los enlaces estándar de invitación y recuperación de Supabase traen la sesión en la URL.
      detectSessionInUrl: true,
      storageKey: 'rb-panel-sesion',
    },
  });
  return cliente;
}

/**
 * Invoca una Edge Function y devuelve su código de error, si lo hay (ver
 * supabase/functions/_compartido/http.js).
 *
 * @param {'invitar-usuario' | 'reconstruir-sitio'} nombre
 * @param {object} [cuerpo]
 * @returns {Promise<{ datos?: any, error?: string, campos?: Record<string, string> }>}
 */
export async function invocarFuncion(nombre, cuerpo = {}) {
  const { data, error } = await clientePanel().functions.invoke(nombre, { body: cuerpo });
  if (!error) return { datos: data };
  try {
    const respuesta = await error.context?.json();
    return { error: respuesta?.error ?? 'desconocido', campos: respuesta?.campos };
  } catch {
    return { error: error.name === 'FunctionsFetchError' ? 'red' : 'desconocido' };
  }
}
