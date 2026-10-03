/**
 * Edge Function reconstruir-sitio (especificación §3.5). Dispara en GitHub el evento
 * repository_dispatch "contenido-actualizado", que recompila y despliega el sitio.
 *
 * La invocan dos vías:
 * - El webhook de la base de datos (Fase 5), con el secreto compartido en x-webhook-secret (§13).
 * - El botón "Actualizar el sitio ahora" del panel, con la sesión de un editor o administrador.
 *
 * Se despliega con verify_jwt = false porque el webhook no envía sesión; la autorización se hace
 * aquí. Variables: GITHUB_DISPATCH_TOKEN, REBUILD_WEBHOOK_SECRET, SITE_URL, y las que provee la
 * plataforma.
 */
import { createClient } from 'npm:@supabase/supabase-js@2.117.2';
import { cabecerasCors, responder, tokenDe } from '../_compartido/http.js';
import { esWebhookAutorizado, peticionDispatch } from './logica.js';

const SITIO = (Deno.env.get('SITE_URL') ?? '').replace(/\/$/, '');
const TOKEN_GITHUB = Deno.env.get('GITHUB_DISPATCH_TOKEN') ?? '';
const SECRETO_WEBHOOK = Deno.env.get('REBUILD_WEBHOOK_SECRET');

const servicio = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  { auth: { persistSession: false, autoRefreshToken: false } },
);

/** ¿La sesión es de un editor o administrador? */
async function esEditor(token) {
  if (!token) return false;
  const { data, error } = await servicio.auth.getUser(token);
  if (error || !data?.user) return false;
  const { data: perfil } = await servicio
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle();
  return perfil?.role === 'admin' || perfil?.role === 'editor';
}

Deno.serve(async (peticion) => {
  const cors = cabecerasCors(peticion.headers.get('origin'), SITIO);
  if (peticion.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (peticion.method !== 'POST') return responder({ error: 'metodo_no_permitido' }, 405, cors);

  let origen;
  if (esWebhookAutorizado(peticion.headers.get('x-webhook-secret'), SECRETO_WEBHOOK)) {
    origen = 'webhook';
  } else if (await esEditor(tokenDe(peticion.headers.get('authorization')))) {
    origen = 'panel';
  } else {
    return responder({ error: 'sin_autorizacion' }, 401, cors);
  }

  if (!TOKEN_GITHUB) return responder({ error: 'sin_configurar' }, 503, cors);

  const { url, init } = peticionDispatch(TOKEN_GITHUB, origen);
  const respuesta = await fetch(url, init);
  if (respuesta.status !== 204) {
    console.error('reconstruir-sitio: GitHub respondió', respuesta.status, await respuesta.text());
    return responder({ error: 'github_rechazo', estado: respuesta.status }, 502, cors);
  }
  return responder({ ok: true, origen }, 202, cors);
});
