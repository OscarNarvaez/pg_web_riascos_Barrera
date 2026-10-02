-- Ajustes tras el revisor de seguridad y rendimiento de Supabase (`supabase db advisors`).

-- 1. Funciones auxiliares fuera de la API ---------------------------------------------------
-- Todo lo que vive en `public` puede llamarse por /rest/v1/rpc/. es_editor(), es_admin() y el
-- disparador crear_perfil() no deben estar expuestas: pasan a un esquema que la API no publica.
-- Las políticas las referencian por identificador interno, así que siguen funcionando.

create schema if not exists privado;
revoke all on schema privado from public;
grant usage on schema privado to authenticated;

alter function public.es_editor() set schema privado;
alter function public.es_admin() set schema privado;
alter function public.crear_perfil() set schema privado;

revoke execute on function privado.es_editor(), privado.es_admin(), privado.crear_perfil() from public, anon;
grant execute on function privado.es_editor(), privado.es_admin() to authenticated;

-- Supabase Auth inserta los usuarios con su propio rol: se le permite explícitamente ejecutar el
-- disparador que crea el perfil, para no depender de los permisos por defecto.
grant usage on schema privado to supabase_auth_admin;
grant execute on function privado.crear_perfil() to supabase_auth_admin;

-- autores_publicos() sigue en `public` a propósito: el detalle de una publicación muestra el
-- nombre de su autor (§5.5). Solo expone nombre y cargo de quien firma contenido publicado.
comment on function public.autores_publicos() is
  'Pública a propósito: nombre y cargo de quienes firman contenido publicado (§5.5).';

-- 2. Una sola política de lectura por rol ----------------------------------------------------
-- Dos políticas permisivas para el mismo rol y acción se evalúan por separado. Se fusionan: el
-- comportamiento es idéntico y lo comprueban las pruebas de supabase/tests/database/.

drop policy "Publicaciones: lectura pública de lo publicado" on public.posts;
drop policy "Publicaciones: los editores leen todo" on public.posts;

create policy "Publicaciones: el público lee lo publicado"
  on public.posts for select to anon
  using (status = 'publicado' and published_at <= now() and deleted_at is null);

create policy "Publicaciones: los usuarios leen lo publicado; los editores, todo"
  on public.posts for select to authenticated
  using (
    (status = 'publicado' and published_at <= now() and deleted_at is null)
    or (select privado.es_editor())
  );

drop policy "Lecturas: lectura pública de lo publicado" on public.external_reads;
drop policy "Lecturas: los editores leen todo" on public.external_reads;

create policy "Lecturas: el público lee lo publicado"
  on public.external_reads for select to anon
  using (status = 'publicado' and published_at <= now() and deleted_at is null);

create policy "Lecturas: los usuarios leen lo publicado; los editores, todo"
  on public.external_reads for select to authenticated
  using (
    (status = 'publicado' and published_at <= now() and deleted_at is null)
    or (select privado.es_editor())
  );

-- Relaciones: la política "for all" de editores incluía la lectura; se separa por acción.
drop policy "Etiquetas de publicaciones: los editores gestionan" on public.post_tags;

create policy "Etiquetas de publicaciones: los editores crean"
  on public.post_tags for insert to authenticated
  with check ((select privado.es_editor()));

create policy "Etiquetas de publicaciones: los editores modifican"
  on public.post_tags for update to authenticated
  using ((select privado.es_editor()))
  with check ((select privado.es_editor()));

create policy "Etiquetas de publicaciones: los editores eliminan"
  on public.post_tags for delete to authenticated
  using ((select privado.es_editor()));

drop policy "Etiquetas de lecturas: los editores gestionan" on public.external_read_tags;

create policy "Etiquetas de lecturas: los editores crean"
  on public.external_read_tags for insert to authenticated
  with check ((select privado.es_editor()));

create policy "Etiquetas de lecturas: los editores modifican"
  on public.external_read_tags for update to authenticated
  using ((select privado.es_editor()))
  with check ((select privado.es_editor()));

create policy "Etiquetas de lecturas: los editores eliminan"
  on public.external_read_tags for delete to authenticated
  using ((select privado.es_editor()));

drop policy "Perfiles: cada usuario lee el suyo" on public.profiles;
drop policy "Perfiles: el admin lee todos" on public.profiles;

create policy "Perfiles: cada usuario lee el suyo; el admin, todos"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()) or (select privado.es_admin()));
