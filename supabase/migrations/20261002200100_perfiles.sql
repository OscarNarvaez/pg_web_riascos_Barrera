-- Perfiles y roles del panel (especificación §6.2, §6.3 y §7.1).

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  job_title text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Usuarios del panel. Rol editor o admin (§7.1).';

alter table public.profiles enable row level security;

-- Funciones auxiliares para las políticas (§6.2): security definer con search_path fijo, para
-- poder consultar profiles desde sus propias políticas sin recursión.
create or replace function public.es_editor()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role in ('admin', 'editor')
  )
$$;

create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  )
$$;

-- Al crear un usuario en Auth se crea su perfil. El rol sale de app_metadata, que solo puede
-- escribir la clave secreta (la Edge Function invitar-usuario o el panel de Supabase); nunca de
-- user_metadata, que controla el propio usuario. Por defecto, editor.
create or replace function public.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    case when new.raw_app_meta_data ->> 'role' = 'admin' then 'admin' else 'editor' end
  );
  return new;
end;
$$;

create trigger al_crear_usuario
  after insert on auth.users
  for each row execute function public.crear_perfil();

-- §6.3: público nada; editor lee el propio; admin todo.
create policy "Perfiles: cada usuario lee el suyo"
  on public.profiles for select to authenticated
  using (id = (select auth.uid()));

create policy "Perfiles: el admin lee todos"
  on public.profiles for select to authenticated
  using ((select public.es_admin()));

create policy "Perfiles: el admin crea"
  on public.profiles for insert to authenticated
  with check ((select public.es_admin()));

create policy "Perfiles: el admin modifica"
  on public.profiles for update to authenticated
  using ((select public.es_admin()))
  with check ((select public.es_admin()));

create policy "Perfiles: el admin elimina"
  on public.profiles for delete to authenticated
  using ((select public.es_admin()));

revoke all on public.profiles from anon;
