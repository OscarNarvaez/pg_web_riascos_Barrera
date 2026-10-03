import { notFound } from 'next/navigation';
import ArticuloPublicacion from '@/components/publicaciones/ArticuloPublicacion';
import Redireccion from '@/components/publicaciones/Redireccion';
import TarjetaPublicacion from '@/components/publicaciones/TarjetaPublicacion';
import { textosPublicaciones as t } from '@/content/es/publicaciones';
import { RESERVA } from '@/config/publicaciones';
import { obtenerContenido, relacionadas } from '@/lib/contenido';
import { SITE_URL } from '@/lib/sitio';

export const dynamicParams = false;

/**
 * Busca la publicación por su slug actual o por uno anterior (§10).
 * @returns {Promise<{ publicacion: import('@/lib/contenido').Publicacion, anterior: boolean } | null>}
 */
async function resolver(slug) {
  const { publicaciones } = await obtenerContenido();
  const actual = publicaciones.find((p) => p.slug === slug);
  if (actual) return { publicacion: actual, anterior: false };
  const movida = publicaciones.find((p) => p.slugsAnteriores.includes(slug));
  return movida ? { publicacion: movida, anterior: true } : null;
}

/**
 * Una página por publicación y una de redirección por cada slug anterior. Sin publicaciones se
 * genera la ruta de reserva (ver RESERVA), porque la exportación estática exige al menos una.
 */
export async function generateStaticParams() {
  const { publicaciones } = await obtenerContenido();
  const slugs = publicaciones.flatMap((p) => [p.slug, ...p.slugsAnteriores]);
  return (slugs.length ? slugs : [RESERVA]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = await resolver(slug);
  if (!r) return {};
  const p = r.publicacion;
  const canonica = `/publicaciones/${p.slug}/`;
  if (r.anterior) {
    return { title: p.metaTitulo, alternates: { canonical: canonica }, robots: { index: false } };
  }
  return {
    title: p.metaTitulo,
    description: p.metaDescripcion,
    alternates: { canonical: canonica },
    openGraph: {
      type: 'article',
      title: p.metaTitulo,
      description: p.metaDescripcion,
      url: canonica,
      publishedTime: p.fecha,
      modifiedTime: p.actualizada,
      authors: p.autor ? [p.autor] : undefined,
      tags: p.etiquetas.map((e) => e.name),
      images: p.imagenSocial ? [{ url: p.imagenSocial }] : undefined,
    },
    twitter: { card: p.imagenSocial ? 'summary_large_image' : 'summary' },
  };
}

export default async function DetallePublicacion({ params }) {
  const { slug } = await params;
  const r = await resolver(slug);
  if (!r) notFound();
  const p = r.publicacion;
  if (r.anterior) return <Redireccion destino={`/publicaciones/${p.slug}/`} titulo={p.titulo} />;

  const { publicaciones } = await obtenerContenido();
  const otras = relacionadas(p, publicaciones);

  return (
    <ArticuloPublicacion publicacion={p} url={`${SITE_URL}/publicaciones/${p.slug}/`}>
      {otras.length > 0 && (
        <section
          aria-labelledby="relacionadas"
          className="contenedor-amplio flex flex-col gap-10 pt-8"
        >
          <h2 id="relacionadas" className="font-titulo text-titulo text-verde">
            {t.relacionadas}
          </h2>
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {otras.map((o) => (
              <TarjetaPublicacion key={o.id} publicacion={o} nivel="h3" />
            ))}
          </div>
        </section>
      )}
    </ArticuloPublicacion>
  );
}
