-- Pruebas de base de datos (especificación §15): RLS, restricciones y búsqueda.
-- Se ejecutan con `supabase test db --linked`. Todo ocurre dentro de una transacción que se
-- revierte al final: no queda ningún dato en la base. Los datos son de prueba y evidentes.
begin;
create extension if not exists pgtap with schema extensions;
set local search_path = public, extensions;

select plan(48);

-- Datos de prueba ----------------------------------------------------------------------------
insert into auth.users (id, email, raw_app_meta_data, raw_user_meta_data) values
  ('00000000-0000-0000-0000-00000000000a', 'admin@prueba.invalid', '{"role":"admin"}', '{"full_name":"Persona Admin"}'),
  ('00000000-0000-0000-0000-00000000000e', 'editor@prueba.invalid', '{}', '{"full_name":"Persona Editora"}');

insert into posts (id, type, title, slug, excerpt, body_text, author_id, status, published_at, is_anonymized, deleted_at) values
  ('10000000-0000-0000-0000-000000000001', 'articulo', 'Contratación estatal en la práctica', 'p-publicada', 'Extracto de prueba.', 'Texto de prueba sobre la licitación pública.', '00000000-0000-0000-0000-00000000000e', 'publicado', now() - interval '1 day', false, null),
  ('10000000-0000-0000-0000-000000000002', 'articulo', 'Borrador de prueba', 'p-borrador', null, 'Texto borrador.', null, 'borrador', null, false, null),
  ('10000000-0000-0000-0000-000000000003', 'articulo', 'Programada de prueba contratación', 'p-programada', null, 'Texto programado.', null, 'publicado', now() + interval '3 days', false, null),
  ('10000000-0000-0000-0000-000000000004', 'articulo', 'Eliminada de prueba', 'p-eliminada', null, 'Texto eliminado.', null, 'publicado', now() - interval '2 days', false, now()),
  ('10000000-0000-0000-0000-000000000005', 'caso', 'Caso de prueba', 'p-caso', null, 'Texto del caso.', null, 'publicado', now() - interval '1 day', true, null);

insert into post_tags (post_id, tag_id) select '10000000-0000-0000-0000-000000000001', id from tags where slug = 'secop';
insert into tags (name, slug) values ('Etiqueta de prueba del borrador', 'prueba-borrador');
insert into post_tags (post_id, tag_id) select '10000000-0000-0000-0000-000000000002', id from tags where slug = 'prueba-borrador';

insert into external_reads (title, source_name, url, comment, status, published_at) values
  ('Lectura de prueba', 'Fuente de prueba', 'https://ejemplo.invalid/a', 'Comentario sobre derecho laboral.', 'publicado', now() - interval '1 day');

insert into referral_partners (name, code) values ('Referente de prueba', 'PRUEBA1');
insert into leads (form_type, name, email, message, how_found, referral_code, consent_accepted, consent_at, consent_policy_version)
values ('contacto', 'Persona', 'persona@prueba.invalid', 'Mensaje', 'Otro', 'PRUEBA1', true, now(), '0');

-- Estructura ---------------------------------------------------------------------------------
select is(
  (select count(*)::int from pg_tables where schemaname = 'public' and not rowsecurity), 0,
  'RLS activado en todas las tablas públicas');
select is((select role from profiles where id = '00000000-0000-0000-0000-00000000000a'), 'admin',
  'el rol admin sale de app_metadata');
select is((select role from profiles where id = '00000000-0000-0000-0000-00000000000e'), 'editor',
  'el rol por defecto es editor');
select is((select count(*)::int from tags where slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$'), 0,
  'todas las etiquetas tienen un slug válido');
select is(generar_slug('Contratación estatal: ¿Año?'), 'contratacion-estatal-ano', 'slug transliterado');
select ok((select search_vector @@ to_tsquery('public.es', 'secop') from posts where slug = 'p-publicada'),
  'el vector de búsqueda incluye las etiquetas');

-- Restricciones ------------------------------------------------------------------------------
select throws_ok(
  $$ insert into posts (type, title, slug, status, published_at, is_anonymized)
     values ('caso', 'Caso sin anonimizar', 'p-caso-mal', 'publicado', now(), false) $$,
  '23514', null, 'un caso no puede publicarse sin is_anonymized');
select throws_ok(
  $$ insert into posts (title, slug, cover_path) values ('Con portada', 'p-portada', 'x.webp') $$,
  '23514', null, 'una portada exige texto alternativo');
select throws_ok(
  $$ insert into posts (title, slug, status) values ('Sin fecha', 'p-sin-fecha', 'publicado') $$,
  '23514', null, 'publicar exige fecha');

select throws_ok(
  $$ insert into posts (title, slug) values ('Reservado', 'casos') $$,
  '23514', null, 'el slug "casos" está reservado para el listado');
select throws_ok(
  $$ insert into posts (title, slug, previous_slugs) values ('Anterior', 'p-anterior', array['pagina']) $$,
  '23514', null, 'un slug anterior tampoco puede ser reservado');

-- Visitante anónimo --------------------------------------------------------------------------
set local role anon;
select results_eq($$ select slug from posts where id::text like '10000000-%' order by slug $$, array['p-caso', 'p-publicada'],
  'anon ve solo lo publicado, con fecha cumplida y no eliminado');
select is((select count(*)::int from post_tags where post_id::text like '10000000-%'), 1,
  'anon solo ve relaciones de contenido visible');
select ok(exists (select 1 from buscar_contenido('contratacion') where slug = 'p-publicada'),
  'búsqueda insensible a tildes');
select ok(exists (select 1 from buscar_contenido('CONTRAT') where slug = 'p-publicada'),
  'búsqueda por prefijo e insensible a mayúsculas');
select ok(not exists (select 1 from buscar_contenido('programada contratacion') where slug = 'p-programada'),
  'la búsqueda no devuelve programadas');
select matches((select fragmento from buscar_contenido('licitacion') limit 1), '\[\[licitación\]\]',
  'el fragmento marca la coincidencia con su tilde original');
select ok(exists (select 1 from buscar_contenido('laboral') where tipo = 'lectura'),
  'la búsqueda incluye lecturas recomendadas');
select is((select count(*)::int from buscar_contenido('!!! & | :* ()')), 0,
  'los símbolos del visitante no se interpretan como operadores');
select ok(exists (select 1 from etiquetas_populares() where slug = 'secop')
  and not exists (select 1 from etiquetas_populares() where slug = 'prueba-borrador'),
  'las etiquetas populares cuentan solo lo visible');
select ok(exists (select 1 from autores_publicos() where id = '00000000-0000-0000-0000-00000000000e')
  and not exists (select 1 from autores_publicos() where id = '00000000-0000-0000-0000-00000000000a'),
  'autores_publicos expone solo a quien firma contenido publicado');
select throws_ok($$ select 1 from leads $$, '42501', null, 'anon no lee contactos');
select throws_ok(
  $$ insert into leads (form_type, name, email, message, how_found, consent_accepted, consent_at, consent_policy_version)
     values ('contacto', 'X', 'x@prueba.invalid', 'M', 'Otro', true, now(), '0') $$,
  '42501', null, 'anon no inserta contactos');
select throws_ok($$ select 1 from profiles $$, '42501', null, 'anon no lee perfiles');
select throws_ok($$ select 1 from rate_limits $$, '42501', null, 'anon no lee rate_limits');
select throws_ok($$ insert into posts (title, slug) values ('Intrusa', 'p-intrusa') $$, '42501', null,
  'anon no crea publicaciones');
select throws_ok($$ select 1 from usuarios_del_panel() $$, '42501', null,
  'anon no lista los usuarios del panel');
reset role;

-- Editor -------------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000e","role":"authenticated"}', true);
select is((select count(*)::int from posts where id::text like '10000000-%'), 5, 'el editor ve todo el contenido');
select is((select count(*)::int from leads), 0, 'el editor no ve contactos');
select is((select count(*)::int from referral_partners), 0, 'el editor no ve referentes');
select is((select count(*)::int from profiles), 1, 'el editor solo ve su perfil');
select lives_ok($$ insert into posts (title, slug) values ('Nueva del editor', 'p-nueva') $$,
  'el editor crea publicaciones');
select is((select author_id from posts where slug = 'p-nueva'), '00000000-0000-0000-0000-00000000000e'::uuid,
  'el autor por defecto es quien crea la publicación');
select throws_ok($$ select 1 from usuarios_del_panel() $$, '42501', null,
  'el editor no lista los usuarios del panel');
update profiles set role = 'admin' where id = '00000000-0000-0000-0000-00000000000e';
select is((select role from profiles where id = '00000000-0000-0000-0000-00000000000e'), 'editor',
  'el editor no puede ascenderse a admin');
select ok(not exists (select 1 from buscar_contenido('borrador') where slug = 'p-borrador'),
  'la búsqueda pública no muestra borradores a un editor');
reset role;

-- Admin --------------------------------------------------------------------------------------
set local role authenticated;
select set_config('request.jwt.claims', '{"sub":"00000000-0000-0000-0000-00000000000a","role":"authenticated"}', true);
select ok(exists (select 1 from leads where email = 'persona@prueba.invalid'), 'el admin ve contactos');
select ok(exists (select 1 from referral_partners where code = 'PRUEBA1'), 'el admin ve referentes');
select lives_ok($$ update leads set status = 'atendido', internal_notes = 'Nota' where email = 'persona@prueba.invalid' $$,
  'el admin actualiza estado y notas');
select throws_ok($$ update leads set email = 'otro@prueba.invalid' $$, '42501', null,
  'el admin no altera los datos del contacto');
select throws_ok($$ delete from leads $$, '42501', null, 'el admin no borra contactos');
select ok(exists (select 1 from usuarios_del_panel() where email = 'editor@prueba.invalid'),
  'el admin lista los usuarios del panel con su correo');
reset role;

-- Panel: slugs anteriores y último administrador (Fase 4) ------------------------------------
update posts set slug = 'p-publicada-nueva' where slug = 'p-publicada';
select is((select previous_slugs from posts where slug = 'p-publicada-nueva'), array['p-publicada'],
  'cambiar el slug de una publicación visible conserva el anterior');
update posts set slug = 'p-programada-nueva' where slug = 'p-programada';
select is((select previous_slugs from posts where slug = 'p-programada-nueva'), '{}'::text[],
  'una publicación que nunca fue visible no conserva slugs anteriores');
select throws_ok($$ insert into posts (title, slug) values ('Choque', 'p-publicada') $$, '23505', null,
  'un slug no puede ser el anterior de otra publicación');
update posts set slug = 'p-publicada' where slug = 'p-publicada-nueva';
select is((select previous_slugs from posts where slug = 'p-publicada'), array['p-publicada-nueva'],
  'volver a un slug anterior lo recupera como actual');

-- Deja a la persona admin de prueba como única administradora (se revierte al final).
update profiles set role = 'editor' where role = 'admin' and id <> '00000000-0000-0000-0000-00000000000a';
select throws_ok(
  $$ update profiles set role = 'editor' where id = '00000000-0000-0000-0000-00000000000a' $$,
  '23514', null, 'no se puede quitar el rol al último administrador');
select throws_ok($$ delete from auth.users where id = '00000000-0000-0000-0000-00000000000a' $$,
  '23514', null, 'no se puede eliminar al último administrador');

select * from finish();
rollback;
