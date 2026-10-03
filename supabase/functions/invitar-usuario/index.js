/**
 * Edge Function invitar-usuario (especificación §7.2). Solo un administrador puede invitar.
 * Supabase Auth envía el correo de invitación; el enlace lleva a /panel/restablecer/, donde la
 * persona define su contraseña. El nombre, el cargo y el rol se guardan en profiles con la clave
 * secreta, que solo existe aquí (§3.3).
 *
 * Variables: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY (las provee la plataforma) y SITE_URL.
 */
import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
import { cabecerasCors, responder, tokenDe } from '../_compartido/http.js';
import { codigoErrorInvitacion, validarInvitacion } from './logica.js';

const SITIO = (Deno.env.get('SITE_URL') ?? '').replace(/\/$/, '');

const servicio = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false, autoRefreshToken: false } },
);

Deno.serve(async (peticion) => {
  const cors = cabecerasCors(peticion.headers.get('origin'), SITIO);
  if (peticion.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (peticion.method !== 'POST') return responder({ error: 'metodo_no_permitido' }, 405, cors);
  if (!SITIO) return responder({ error: 'sin_configurar' }, 503, cors);

  // Quién llama: sesión válida y rol admin en profiles.
  const token = tokenDe(peticion.headers.get('authorization'));
  const { data: sesion, error: errorSesion } = await servicio.auth.getUser(token);
  if (errorSesion || !sesion?.user) return responder({ error: 'sin_sesion' }, 401, cors);
  const { data: perfil } = await servicio
    .from('profiles')
    .select('role')
    .eq('id', sesion.user.id)
    .maybeSingle();
  if (perfil?.role !== 'admin') return responder({ error: 'solo_admin' }, 403, cors);

  let cuerpo;
  try {
    cuerpo = await peticion.json();
  } catch {
    return responder({ error: 'cuerpo_invalido' }, 400, cors);
  }
  const validacion = validarInvitacion(cuerpo);
  if ('errores' in validacion) {
    return responder({ error: 'validacion', campos: validacion.errores }, 422, cors);
  }
  const { email, nombre, cargo, rol } = validacion.datos;

  const { data, error } = await servicio.auth.admin.inviteUserByEmail(email, {
    data: { full_name: nombre },
    redirectTo: `${SITIO}/panel/restablecer/`,
  });
  if (error || !data?.user) {
    const codigo = codigoErrorInvitacion(error);
    console.error('invitar-usuario:', codigo, error?.message);
    return responder({ error: codigo }, codigo === 'correo_existente' ? 409 : 502, cors);
  }

  const { error: errorPerfil } = await servicio
    .from('profiles')
    .update({ full_name: nombre, job_title: cargo, role: rol })
    .eq('id', data.user.id);
  if (errorPerfil) {
    console.error('invitar-usuario: perfil', errorPerfil.message);
    return responder({ error: 'perfil_no_actualizado', id: data.user.id }, 500, cors);
  }

  return responder({ ok: true, id: data.user.id }, 200, cors);
});
