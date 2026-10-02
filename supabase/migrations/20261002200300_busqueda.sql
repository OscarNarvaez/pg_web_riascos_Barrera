-- Búsqueda en español, insensible a tildes y mayúsculas, con prefijos (especificación §5.6 y §6.4).

-- Convierte lo que escribe el visitante en una consulta con prefijo en cada palabra: "contrata
-- est" → 'contrat':* & 'est':*. Solo letras y números: nunca interpreta operadores del usuario.
create or replace function public.consulta_busqueda(q text)
returns tsquery
language sql
stable
set search_path = ''
as $$
  select to_tsquery('public.es', string_agg(palabra || ':*', ' & '))
  from regexp_split_to_table(lower(public.sin_tildes(coalesce(q, ''))), '[^a-z0-9]+') as palabra
  where palabra <> ''
$$;

-- security invoker: se ejecuta con los permisos de quien la llama, así que RLS aplica igual.
-- Además filtra lo publicado de forma explícita: un editor que busca en el sitio público no ve
-- borradores. Los fragmentos marcan las coincidencias con [[ y ]]: el navegador escapa el texto
-- y solo después convierte esas marcas en <mark>, para no inyectar HTML.
create or replace function public.buscar_contenido(q text, limite int default 20)
returns table (
  tipo text,
  id uuid,
  titulo text,
  slug text,
  url text,
  fuente text,
  fragmento text,
  fecha timestamptz,
  rango real
)
language sql
stable
security invoker
set search_path = ''
as $$
  with consulta as (select public.consulta_busqueda(q) as tsq)
  select * from (
    select
      p.type as tipo,
      p.id,
      p.title as titulo,
      p.slug,
      null::text as url,
      null::text as fuente,
      ts_headline(
        'public.es',
        concat_ws(' ', p.excerpt, left(p.body_text, 5000)),
        c.tsq,
        'StartSel=[[, StopSel=]], MaxWords=32, MinWords=14, ShortWord=2, MaxFragments=1'
      ) as fragmento,
      p.published_at as fecha,
      ts_rank(p.search_vector, c.tsq) as rango
    from public.posts p, consulta c
    where c.tsq is not null
      and p.search_vector @@ c.tsq
      and p.status = 'publicado' and p.published_at <= now() and p.deleted_at is null
    union all
    select
      'lectura',
      r.id,
      r.title,
      null,
      r.url,
      r.source_name,
      ts_headline(
        'public.es',
        coalesce(r.comment, r.title),
        c.tsq,
        'StartSel=[[, StopSel=]], MaxWords=32, MinWords=14, ShortWord=2, MaxFragments=1'
      ),
      r.published_at,
      ts_rank(r.search_vector, c.tsq)
    from public.external_reads r, consulta c
    where c.tsq is not null
      and r.search_vector @@ c.tsq
      and r.status = 'publicado' and r.published_at <= now() and r.deleted_at is null
  ) resultados
  order by rango desc, fecha desc
  limit least(greatest(coalesce(limite, 20), 1), 50)
$$;

-- Etiquetas con contenido publicado, de la más usada a la menos (estado vacío del buscador y
-- etiquetas sugeridas, §5.6). Invoker: cuenta solo lo que quien llama puede ver.
create or replace function public.etiquetas_populares(limite int default 8)
returns table (id uuid, name text, slug text, total bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select t.id, t.name, t.slug, count(*) as total
  from public.tags t
  join (
    select pt.tag_id from public.post_tags pt
    join public.posts p on p.id = pt.post_id
    where p.status = 'publicado' and p.published_at <= now() and p.deleted_at is null
    union all
    select rt.tag_id from public.external_read_tags rt
    join public.external_reads r on r.id = rt.external_read_id
    where r.status = 'publicado' and r.published_at <= now() and r.deleted_at is null
  ) usos on usos.tag_id = t.id
  group by t.id
  order by total desc, t.name
  limit least(greatest(coalesce(limite, 8), 1), 30)
$$;

-- Autoría pública (§5.5): el detalle de una publicación muestra el nombre de su autor, pero el
-- público no puede leer profiles (§6.3). Esta función expone solo nombre y cargo, y solo de
-- quienes firman contenido publicado.
create or replace function public.autores_publicos()
returns table (id uuid, full_name text, job_title text)
language sql
stable
security definer
set search_path = ''
as $$
  select pr.id, pr.full_name, pr.job_title
  from public.profiles pr
  where exists (
    select 1 from public.posts p
    where p.author_id = pr.id
      and p.status = 'publicado' and p.published_at <= now() and p.deleted_at is null
  )
$$;
