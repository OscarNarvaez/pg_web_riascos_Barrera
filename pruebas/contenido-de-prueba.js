/**
 * Contenido de prueba para revisar las páginas de publicaciones en local (CONTENIDO_DE_PRUEBA=1).
 * Texto deliberadamente genérico: nada aquí es contenido de la firma ni debe publicarse.
 * Tiene la misma forma que las filas de Supabase (src/lib/contenido.js).
 */
const etiqueta = (slug, name) => ({ tags: { id: slug, slug, name } });
const cuerpo = (n) =>
  `<h2>Sección de prueba ${n}</h2><p>Texto de prueba para revisar la tipografía de lectura. ` +
  `Este párrafo no es contenido de la firma.</p><ul><li>Elemento de prueba uno</li>` +
  `<li>Elemento de prueba dos</li></ul><blockquote><p>Cita de prueba.</p></blockquote>` +
  `<p><a href="https://ejemplo.invalid" target="_blank">Enlace de prueba</a></p>`;

const posts = Array.from({ length: 11 }, (_, i) => {
  const n = 11 - i;
  return {
    id: `prueba-${n}`,
    type: n === 3 ? 'caso' : 'articulo',
    title: `Publicación de prueba ${n}`,
    slug: `publicacion-de-prueba-${n}`,
    excerpt: `Extracto de prueba ${n}, solo para revisar el diseño del listado.`,
    body_html: cuerpo(n),
    body_text: 'Texto de prueba. '.repeat(120 * ((n % 4) + 1)),
    cover_path: null,
    cover_alt: null,
    author_id: n % 2 ? 'autor-prueba' : null,
    practice_area: null,
    published_at: new Date(Date.UTC(2026, 8, 30 - i)).toISOString(),
    updated_at: new Date(Date.UTC(2026, 9, 1)).toISOString(),
    meta_title: null,
    meta_description: null,
    og_image_path: null,
    reading_minutes: null,
    previous_slugs: n === 11 ? ['slug-anterior-de-prueba'] : [],
    post_tags: [
      ...(n === 10 ? [etiqueta('cumplimiento-normativo', 'Cumplimiento normativo')] : []),
      etiqueta('secop', 'SECOP'),
      ...(n % 2 ? [etiqueta('criterio', 'Criterio')] : []),
      ...(n % 3 === 0 ? [etiqueta('normativa', 'Normativa')] : []),
    ],
  };
});

export const filas = {
  posts,
  lecturas: [
    {
      id: 'lectura-prueba-1',
      title: 'Lectura recomendada de prueba',
      source_name: 'Fuente de prueba',
      url: 'https://ejemplo.invalid/lectura',
      comment: 'Comentario de prueba sobre la lectura.',
      published_at: new Date(Date.UTC(2026, 8, 28)).toISOString(),
      external_read_tags: [etiqueta('normativa', 'Normativa')],
    },
  ],
  autores: [{ id: 'autor-prueba', full_name: 'Autoría de prueba' }],
};
