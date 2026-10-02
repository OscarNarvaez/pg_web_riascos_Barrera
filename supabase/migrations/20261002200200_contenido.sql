-- Contenido: publicaciones, lecturas recomendadas y etiquetas (especificación §6.2 a §6.4).

-- Etiquetas ---------------------------------------------------------------------------------

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  created_at timestamptz not null default now()
);

alter table public.tags enable row level security;

-- Publicaciones de la firma: artículos y casos ------------------------------------------------

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  type text not null default 'articulo' check (type in ('articulo', 'caso')),
  title text not null check (length(trim(title)) > 0),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  excerpt text check (char_length(excerpt) <= 300),
  body_html text not null default '',
  body_text text not null default '',
  cover_path text,
  cover_alt text,
  author_id uuid references public.profiles (id) on delete set null,
  practice_area text check (
    practice_area in ('derecho-publico', 'litigio-administrativo', 'derecho-laboral', 'derecho-privado')
  ),
  status text not null default 'borrador' check (status in ('borrador', 'publicado')),
  published_at timestamptz,
  is_anonymized boolean not null default false,
  meta_title text,
  meta_description text,
  og_image_path text,
  reading_minutes integer check (reading_minutes > 0),
  previous_slugs text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  search_vector tsvector,

  -- Texto alternativo obligatorio si hay portada (§6.2).
  constraint portada_con_texto_alternativo
    check (cover_path is null or length(trim(coalesce(cover_alt, ''))) > 0),
  -- Un caso publicado debe estar anonimizado (§6.2). Restricción en base de datos, no solo
  -- en el panel.
  constraint caso_publicado_anonimizado
    check (type <> 'caso' or status <> 'publicado' or is_anonymized),
  -- Una publicación publicada necesita fecha; una fecha futura la programa (§3.5).
  constraint publicado_con_fecha
    check (status <> 'publicado' or published_at is not null)
);

comment on column public.posts.previous_slugs is
  'Slugs anteriores: en cada uno se genera una página de redirección (§10).';

create index posts_busqueda_idx on public.posts using gin (search_vector);
create index posts_publicados_idx on public.posts (published_at desc)
  where status = 'publicado' and deleted_at is null;

alter table public.posts enable row level security;

create trigger posts_fecha_modificacion
  before update on public.posts
  for each row execute function public.actualizar_fecha_modificacion();

-- Lecturas recomendadas (§5.5): solo título, fuente, enlace y comentario de la firma ------------

create table public.external_reads (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(trim(title)) > 0),
  source_name text not null check (length(trim(source_name)) > 0),
  url text not null check (url ~* '^https?://[^[:space:]]+$'),
  comment text check (char_length(comment) <= 500),
  status text not null default 'borrador' check (status in ('borrador', 'publicado')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  search_vector tsvector,
  constraint publicado_con_fecha check (status <> 'publicado' or published_at is not null)
);

create index external_reads_busqueda_idx on public.external_reads using gin (search_vector);
create index external_reads_publicadas_idx on public.external_reads (published_at desc)
  where status = 'publicado' and deleted_at is null;

alter table public.external_reads enable row level security;

create trigger external_reads_fecha_modificacion
  before update on public.external_reads
  for each row execute function public.actualizar_fecha_modificacion();

-- Relaciones con etiquetas ------------------------------------------------------------------

create table public.post_tags (
  post_id uuid not null references public.posts (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (post_id, tag_id)
);

create index post_tags_tag_idx on public.post_tags (tag_id);

create table public.external_read_tags (
  external_read_id uuid not null references public.external_reads (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (external_read_id, tag_id)
);

create index external_read_tags_tag_idx on public.external_read_tags (tag_id);

alter table public.post_tags enable row level security;
alter table public.external_read_tags enable row level security;

-- Vector de búsqueda (§6.4) -----------------------------------------------------------------
-- Título (A), extracto y etiquetas (B), cuerpo (C). Las etiquetas viven en otra tabla y una
-- columna generada no puede consultarla: el vector lo mantienen triggers.

create or replace function public.vector_de_post(p public.posts)
returns tsvector
language sql
stable
set search_path = ''
as $$
  select
    setweight(to_tsvector('public.es', coalesce(p.title, '')), 'A')
    || setweight(to_tsvector('public.es', concat_ws(' ', p.excerpt, (
         select string_agg(t.name, ' ')
         from public.post_tags pt join public.tags t on t.id = pt.tag_id
         where pt.post_id = p.id
       ))), 'B')
    || setweight(to_tsvector('public.es', coalesce(p.body_text, '')), 'C')
$$;

create or replace function public.vector_de_lectura(r public.external_reads)
returns tsvector
language sql
stable
set search_path = ''
as $$
  select
    setweight(to_tsvector('public.es', coalesce(r.title, '')), 'A')
    || setweight(to_tsvector('public.es', concat_ws(' ', r.source_name, r.comment, (
         select string_agg(t.name, ' ')
         from public.external_read_tags rt join public.tags t on t.id = rt.tag_id
         where rt.external_read_id = r.id
       ))), 'B')
$$;

create or replace function public.actualizar_vector_post()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.search_vector = public.vector_de_post(new);
  return new;
end;
$$;

create or replace function public.actualizar_vector_lectura()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.search_vector = public.vector_de_lectura(new);
  return new;
end;
$$;

create trigger posts_vector
  before insert or update of title, excerpt, body_text on public.posts
  for each row execute function public.actualizar_vector_post();

create trigger external_reads_vector
  before insert or update of title, source_name, comment on public.external_reads
  for each row execute function public.actualizar_vector_lectura();

-- Al cambiar las etiquetas de un contenido, o el nombre de una etiqueta, se recalcula.
create or replace function public.recalcular_vector_por_etiquetas()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_table_name = 'post_tags' then
    update public.posts p set search_vector = public.vector_de_post(p)
    where p.id = coalesce(new.post_id, old.post_id);
  elsif tg_table_name = 'external_read_tags' then
    update public.external_reads r set search_vector = public.vector_de_lectura(r)
    where r.id = coalesce(new.external_read_id, old.external_read_id);
  elsif tg_table_name = 'tags' then
    update public.posts p set search_vector = public.vector_de_post(p)
    where p.id in (select post_id from public.post_tags where tag_id = new.id);
    update public.external_reads r set search_vector = public.vector_de_lectura(r)
    where r.id in (select external_read_id from public.external_read_tags where tag_id = new.id);
  end if;
  return null;
end;
$$;

create trigger post_tags_vector
  after insert or delete on public.post_tags
  for each row execute function public.recalcular_vector_por_etiquetas();

create trigger external_read_tags_vector
  after insert or delete on public.external_read_tags
  for each row execute function public.recalcular_vector_por_etiquetas();

create trigger tags_vector
  after update of name on public.tags
  for each row execute function public.recalcular_vector_por_etiquetas();

-- Políticas RLS (§6.3) ----------------------------------------------------------------------
-- Público: solo lo publicado, con fecha cumplida y no eliminado. Editor y admin: todo.

create policy "Publicaciones: lectura pública de lo publicado"
  on public.posts for select to anon, authenticated
  using (status = 'publicado' and published_at <= now() and deleted_at is null);

create policy "Publicaciones: los editores leen todo"
  on public.posts for select to authenticated
  using ((select public.es_editor()));

create policy "Publicaciones: los editores crean"
  on public.posts for insert to authenticated
  with check ((select public.es_editor()));

create policy "Publicaciones: los editores modifican"
  on public.posts for update to authenticated
  using ((select public.es_editor()))
  with check ((select public.es_editor()));

create policy "Publicaciones: los editores eliminan"
  on public.posts for delete to authenticated
  using ((select public.es_editor()));

create policy "Lecturas: lectura pública de lo publicado"
  on public.external_reads for select to anon, authenticated
  using (status = 'publicado' and published_at <= now() and deleted_at is null);

create policy "Lecturas: los editores leen todo"
  on public.external_reads for select to authenticated
  using ((select public.es_editor()));

create policy "Lecturas: los editores crean"
  on public.external_reads for insert to authenticated
  with check ((select public.es_editor()));

create policy "Lecturas: los editores modifican"
  on public.external_reads for update to authenticated
  using ((select public.es_editor()))
  with check ((select public.es_editor()));

create policy "Lecturas: los editores eliminan"
  on public.external_reads for delete to authenticated
  using ((select public.es_editor()));

create policy "Etiquetas: lectura pública"
  on public.tags for select to anon, authenticated
  using (true);

create policy "Etiquetas: los editores crean"
  on public.tags for insert to authenticated
  with check ((select public.es_editor()));

create policy "Etiquetas: los editores modifican"
  on public.tags for update to authenticated
  using ((select public.es_editor()))
  with check ((select public.es_editor()));

create policy "Etiquetas: los editores eliminan"
  on public.tags for delete to authenticated
  using ((select public.es_editor()));

-- Relaciones: el público las lee solo para contenido que puede ver, para no revelar
-- identificadores de borradores ni de publicaciones programadas.
create policy "Etiquetas de publicaciones: lectura de lo visible"
  on public.post_tags for select to anon, authenticated
  using (exists (select 1 from public.posts p where p.id = post_id));

create policy "Etiquetas de publicaciones: los editores gestionan"
  on public.post_tags for all to authenticated
  using ((select public.es_editor()))
  with check ((select public.es_editor()));

create policy "Etiquetas de lecturas: lectura de lo visible"
  on public.external_read_tags for select to anon, authenticated
  using (exists (select 1 from public.external_reads r where r.id = external_read_id));

create policy "Etiquetas de lecturas: los editores gestionan"
  on public.external_read_tags for all to authenticated
  using ((select public.es_editor()))
  with check ((select public.es_editor()));

-- Etiquetas iniciales (§6.2), modificables por la firma -------------------------------------

insert into public.tags (name, slug)
select nombre, public.generar_slug(nombre)
from unnest(array[
  'Criterio',
  'Normativa',
  'Preguntas frecuentes',
  'SECOP',
  'Contratación estatal',
  'Litigio administrativo',
  'Derecho laboral',
  'Derecho privado',
  'Cumplimiento normativo'
]) as nombre
on conflict (slug) do nothing;
