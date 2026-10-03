-- Reglas de la base que necesita el panel de administración (especificación §7 y §10).

-- 1. Slugs anteriores automáticos ----------------------------------------------------------
-- Si cambia el slug de una publicación que ya estaba visible en el sitio, el anterior se conserva
-- para generar su página de redirección (§10). Una publicación que nunca fue visible (borrador o
-- programada) no tiene URL que preservar. Se hace en la base y no en el panel para que ninguna
-- vía de edición pueda olvidarlo.

create or replace function public.conservar_slug_anterior()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE'
     and new.slug is distinct from old.slug
     and old.status = 'publicado'
     and old.published_at <= now()
     and old.deleted_at is null then
    new.previous_slugs = array_append(array_remove(new.previous_slugs, old.slug), old.slug);
  end if;
  -- Volver a un slug anterior lo convierte otra vez en el actual.
  new.previous_slugs = array_remove(new.previous_slugs, new.slug);

  -- Un slug actual no puede ser el anterior de otra publicación: las dos páginas ocuparían la
  -- misma ruta.
  if exists (
    select 1 from public.posts p
    where p.id <> new.id and new.slug = any (p.previous_slugs)
  ) then
    raise exception 'El slug "%" redirige a otra publicación.', new.slug
      using errcode = '23505', hint = 'slug_anterior_de_otra';
  end if;
  return new;
end;
$$;

create trigger posts_slug_anterior
  before insert or update of slug, previous_slugs on public.posts
  for each row execute function public.conservar_slug_anterior();

-- El autor de una publicación nueva es, por defecto, quien la crea.
alter table public.posts alter column author_id set default auth.uid();

-- 2. Siempre queda al menos un administrador -----------------------------------------------
-- Sin admin nadie podría gestionar contactos, referentes ni usuarios (§7.1).

create or replace function privado.conservar_un_admin()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if old.role = 'admin'
     and (tg_op = 'DELETE' or new.role <> 'admin')
     and not exists (
       select 1 from public.profiles where role = 'admin' and id <> old.id
     ) then
    raise exception 'Debe quedar al menos un administrador.'
      using errcode = '23514', hint = 'ultimo_admin';
  end if;
  return coalesce(new, old);
end;
$$;

revoke execute on function privado.conservar_un_admin() from public, anon, authenticated;

create trigger profiles_conservar_un_admin
  before update of role or delete on public.profiles
  for each row execute function privado.conservar_un_admin();

-- 3. Usuarios del panel --------------------------------------------------------------------
-- El correo y el último acceso viven en auth.users, que la API no expone. Esta función los
-- entrega solo a un administrador (§7.2, módulo Usuarios); a cualquier otro le niega el acceso.

create or replace function public.usuarios_del_panel()
returns table (
  id uuid,
  email text,
  full_name text,
  job_title text,
  role text,
  created_at timestamptz,
  last_sign_in_at timestamptz,
  confirmado boolean
)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not privado.es_admin() then
    raise exception 'Solo un administrador puede consultar los usuarios.' using errcode = '42501';
  end if;
  return query
    select p.id, u.email::text, p.full_name, p.job_title, p.role, p.created_at,
           u.last_sign_in_at, u.email_confirmed_at is not null
    from public.profiles p
    join auth.users u on u.id = p.id
    order by p.created_at;
end;
$$;

revoke execute on function public.usuarios_del_panel() from public, anon;
grant execute on function public.usuarios_del_panel() to authenticated;

comment on function public.usuarios_del_panel() is
  'Solo admin: usuarios del panel con correo y último acceso (§7.2).';
