-- Base: extensiones, normalización de texto y utilidades (especificación §6.1 y §6.4).

create extension if not exists unaccent with schema extensions;

-- unaccent envuelta en una función IMMUTABLE para poder usarla en índices y columnas generadas
-- (§6.4). Se fija el diccionario explícitamente para que el resultado no dependa del search_path.
create or replace function public.sin_tildes(texto text)
returns text
language sql
immutable
parallel safe
strict
set search_path = ''
as $$
  select extensions.unaccent('extensions.unaccent'::regdictionary, texto)
$$;

comment on function public.sin_tildes(text) is
  'Quita tildes y diacríticos (á→a, ñ→n). IMMUTABLE para índices (§6.4).';

-- Slug con transliteración de tildes y eñes (§6.2): "Contratación estatal" → "contratacion-estatal".
create or replace function public.generar_slug(texto text)
returns text
language sql
immutable
parallel safe
strict
set search_path = ''
as $$
  select trim(both '-' from regexp_replace(lower(public.sin_tildes(texto)), '[^a-z0-9]+', '-', 'g'))
$$;

-- Configuración de búsqueda en español insensible a tildes (§6.4): el diccionario unaccent
-- filtra cada palabra antes del lematizador. Con ella, ts_headline resalta las palabras con
-- tildes aunque la consulta se escriba sin ellas.
create text search configuration public.es (copy = pg_catalog.spanish);

alter text search configuration public.es
  alter mapping for hword, hword_part, word
  with extensions.unaccent, spanish_stem;

-- Fecha de modificación automática.
create or replace function public.actualizar_fecha_modificacion()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
