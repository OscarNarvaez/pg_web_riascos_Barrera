import Link from 'next/link';
import MetaPublicacion from './MetaPublicacion';
import Portada from './Portada';

/**
 * Elemento del listado: portada, datos, título y extracto, sobre marfil y sin caja ni sombra.
 * El enlace del título cubre toda la tarjeta con ::before (::after es su subrayado).
 * @param {{ publicacion: import('@/lib/contenido').Publicacion, nivel?: 'h2' | 'h3' }} props
 */
export default function TarjetaPublicacion({ publicacion: p, nivel: Titulo = 'h2' }) {
  return (
    <article className="group relative flex flex-col gap-4">
      <Portada publicacion={p} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
      <MetaPublicacion publicacion={p} />
      <Titulo className="font-titulo text-subtitulo text-verde">
        <Link
          href={`/publicaciones/${p.slug}/`}
          className="subrayado-animado before:absolute before:inset-0"
        >
          {p.titulo}
        </Link>
      </Titulo>
      {p.extracto && <p className="line-clamp-3 text-verde-gris">{p.extracto}</p>}
    </article>
  );
}
