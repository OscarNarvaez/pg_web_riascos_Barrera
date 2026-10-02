-- Almacenamiento de imágenes de publicaciones (especificación §6.5 y §7.3).
-- Bucket público: las imágenes se sirven por URL pública sin política de lectura, así que el
-- público no puede listar el contenido del bucket. El panel sube WebP ya convertido en el
-- navegador (el plan gratuito no transforma imágenes).

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('publicaciones', 'publicaciones', true, 10485760, array['image/webp'])
on conflict (id) do nothing;

create policy "Publicaciones: los editores listan"
  on storage.objects for select to authenticated
  using (bucket_id = 'publicaciones' and (select public.es_editor()));

create policy "Publicaciones: los editores suben"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'publicaciones' and (select public.es_editor()));

create policy "Publicaciones: los editores reemplazan"
  on storage.objects for update to authenticated
  using (bucket_id = 'publicaciones' and (select public.es_editor()))
  with check (bucket_id = 'publicaciones' and (select public.es_editor()));

create policy "Publicaciones: los editores eliminan"
  on storage.objects for delete to authenticated
  using (bucket_id = 'publicaciones' and (select public.es_editor()));
