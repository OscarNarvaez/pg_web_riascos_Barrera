import { firma } from '@/config/firma';
import { textosPublicaciones as t } from '@/content/es/publicaciones';

/**
 * Portada de una publicación. Si no tiene imagen, una portada tipográfica con los tokens de la
 * marca (§5.5), nunca una foto genérica. No repite el título, que va justo debajo: muestra la
 * etiqueta principal, y el color distingue el tipo (casos en verde profundo, artículos en tinte
 * de oliva), para que el listado no sea una rejilla de bloques idénticos.
 *
 * @param {{ publicacion: import('@/lib/contenido').Publicacion, prioritaria?: boolean, sizes?: string, className?: string }} props
 */
export default function Portada({
  publicacion,
  prioritaria = false,
  sizes = '100vw',
  className = '',
}) {
  const { portada } = publicacion;
  if (portada) {
    return (
      <img
        src={portada.grande}
        srcSet={`${portada.mediana} 800w, ${portada.grande} 1600w`}
        sizes={sizes}
        alt={portada.alt}
        width={1600}
        height={900}
        loading={prioritaria ? 'eager' : 'lazy'}
        fetchPriority={prioritaria ? 'high' : undefined}
        decoding="async"
        className={`aspect-video w-full rounded-mosaico bg-oliva/15 object-cover ${className}`}
      />
    );
  }

  const caso = publicacion.tipo === 'caso';
  const tema = publicacion.etiquetas[0]?.name ?? (caso ? firma.nombreSeccionCasos : t.articulo);
  return (
    <div
      aria-hidden="true"
      className={`flex aspect-video w-full flex-col justify-between overflow-hidden rounded-mosaico p-6 sm:p-8 ${
        caso ? 'bg-verde text-marfil' : 'bg-oliva/15 text-verde'
      } ${className}`}
    >
      <span className="h-px w-12 bg-oro" />
      <span className="font-titulo text-subtitulo [overflow-wrap:anywhere]">{tema}</span>
      <span className={`text-pequeno ${caso ? 'text-marfil/75' : 'text-verde'}`}>
        {firma.nombre}
      </span>
    </div>
  );
}
