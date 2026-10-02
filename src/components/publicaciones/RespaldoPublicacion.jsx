'use client';

import { useEffect, useState } from 'react';
import { SLUGS_RESERVADOS, VARIANTES_PORTADA } from '@/config/publicaciones';
import { BASE_PATH, SITE_URL } from '@/lib/sitio';
import ArticuloPublicacion from './ArticuloPublicacion';

const PATRON = /^\/publicaciones\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/;

/** Slug de una ruta de publicación, o null. */
export function slugDeRuta(ruta) {
  const relativa = BASE_PATH && ruta.startsWith(BASE_PATH) ? ruta.slice(BASE_PATH.length) : ruta;
  const slug = relativa.match(PATRON)?.[1] ?? null;
  return slug && !SLUGS_RESERVADOS.includes(slug) ? slug : null;
}

async function cargar(slug) {
  const [{ clientePublico, urlPublica }, { sanearHtml }] = await Promise.all([
    import('@/lib/supabase'),
    import('@/lib/sanear'),
  ]);
  const cliente = clientePublico();
  if (!cliente) return null;
  const campos =
    'id, type, title, slug, excerpt, body_html, body_text, cover_path, cover_alt, published_at, updated_at, reading_minutes, post_tags(tags(id, name, slug))';

  const { data } = await cliente.from('posts').select(campos).eq('slug', slug).maybeSingle();
  if (data) {
    const grande = urlPublica(data.cover_path);
    const palabras = (data.body_text ?? '').split(/\s+/).filter(Boolean).length;
    return {
      publicacion: {
        id: data.id,
        tipo: data.type,
        titulo: data.title,
        slug: data.slug,
        extracto: data.excerpt ?? '',
        html: sanearHtml(data.body_html ?? ''),
        portada: grande
          ? {
              grande,
              mediana: grande.replace(VARIANTES_PORTADA.grande, VARIANTES_PORTADA.mediana),
              alt: data.cover_alt ?? '',
            }
          : null,
        autor: null,
        fecha: data.published_at,
        minutos: data.reading_minutes ?? Math.max(1, Math.round(palabras / 200)),
        etiquetas: (data.post_tags ?? []).map((r) => r.tags).filter(Boolean),
      },
    };
  }

  // ¿Es un slug anterior de una publicación que aún no tiene su página de redirección?
  const { data: movida } = await cliente
    .from('posts')
    .select('slug')
    .contains('previous_slugs', [slug])
    .maybeSingle();
  return movida ? { destino: `/publicaciones/${movida.slug}/` } : null;
}

/**
 * Respaldo inmediato (§3.5): si alguien visita una publicación recién publicada antes de que
 * termine la compilación, GitHub Pages sirve 404.html. Aquí se reconoce la ruta
 * /publicaciones/{slug}/ y se carga la publicación desde Supabase en el navegador. La versión
 * prerenderizada sigue siendo la principal; esto es solo un puente de unos minutos.
 *
 * @param {{ children: import('react').ReactNode }} props El 404 normal.
 */
export default function RespaldoPublicacion({ children }) {
  const [estado, setEstado] = useState({ fase: 'inicial' });

  useEffect(() => {
    const slug = slugDeRuta(window.location.pathname);
    if (!slug) return undefined;
    let vigente = true;
    cargar(slug)
      .then((r) => {
        if (!vigente) return;
        if (r?.destino) window.location.replace(`${BASE_PATH}${r.destino}`);
        else if (r?.publicacion) {
          document.title = r.publicacion.titulo;
          setEstado({ fase: 'encontrada', publicacion: r.publicacion });
        }
      })
      .catch(() => {});
    return () => {
      vigente = false;
    };
  }, []);

  if (estado.fase === 'encontrada') {
    const p = estado.publicacion;
    return <ArticuloPublicacion publicacion={p} url={`${SITE_URL}/publicaciones/${p.slug}/`} />;
  }
  return children;
}
