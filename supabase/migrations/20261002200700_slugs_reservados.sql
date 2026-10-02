-- Slugs reservados (especificación §4.1). /publicaciones/casos/, /publicaciones/pagina/{n}/ y
-- /publicaciones/etiqueta/{slug}/ comparten espacio con /publicaciones/{slug}/: una publicación
-- con uno de estos slugs quedaría inaccesible. Aplica también a los slugs anteriores, que generan
-- páginas de redirección en la misma ruta.

alter table public.posts
  add constraint slug_no_reservado
    check (slug not in ('casos', 'pagina', 'etiqueta')),
  add constraint slugs_anteriores_no_reservados
    check (not (previous_slugs && array['casos', 'pagina', 'etiqueta']));
