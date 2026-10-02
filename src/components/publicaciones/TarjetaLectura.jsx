import { textosLecturas as t } from '@/content/es/publicaciones';
import { formatearFecha } from '@/lib/fechas';
import EtiquetasEnlazadas from './EtiquetasEnlazadas';

/**
 * Lectura recomendada (§5.5): título, fuente, fecha, comentario de la firma y enlace externo.
 * Nunca se reproduce el contenido del artículo externo (regla 9).
 * @param {{ lectura: import('@/lib/contenido').Lectura, nivel?: 'h2' | 'h3' }} props
 */
export default function TarjetaLectura({ lectura: l, nivel: Titulo = 'h2' }) {
  return (
    <article className="flex flex-col gap-4 border-t border-oro py-8">
      <p className="flex flex-wrap gap-x-2 text-pequeno text-verde-gris">
        <span>{l.fuente}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={l.fecha}>{formatearFecha(l.fecha)}</time>
      </p>
      <Titulo className="font-titulo text-subtitulo text-verde">{l.titulo}</Titulo>
      {l.comentario && <p className="max-w-prose">{l.comentario}</p>}
      <a
        href={l.url}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="group inline-flex min-h-11 items-center gap-1.5 self-start font-medium text-verde"
      >
        <span className="subrayado-animado">{t.leerEnLaFuente(l.fuente)}</span>
        <span
          aria-hidden="true"
          className="text-oro transition-transform duration-(--duracion-micro) ease-estandar group-hover:translate-x-0.5"
        >
          ›
        </span>
        <span className="sr-only">{t.abreEnOtraPestana}</span>
      </a>
      <EtiquetasEnlazadas etiquetas={l.etiquetas} />
    </article>
  );
}
