import { publicaciones as t } from '@/content/es/panel';

/** Recorta un texto al límite aproximado que muestra Google, en una palabra completa. */
function recortar(texto, maximo) {
  if (texto.length <= maximo) return texto;
  const corto = texto.slice(0, maximo);
  return `${corto.slice(0, corto.lastIndexOf(' ') > 0 ? corto.lastIndexOf(' ') : maximo)} …`;
}

/**
 * Aproximación de cómo podría verse la publicación en los resultados de Google (§7.2). Es una
 * guía: Google decide el título y el fragmento que muestra.
 *
 * @param {{ titulo: string, url: string, descripcion: string }} props
 */
export default function VistaGoogle({ titulo, url, descripcion }) {
  return (
    <figure className="flex flex-col gap-3">
      <figcaption className="font-medium text-verde">{t.vistaGoogle}</figcaption>
      <div className="flex max-w-xl flex-col gap-1 rounded-mosaico border border-verde/15 p-5">
        <span className="text-pequeno [overflow-wrap:anywhere] text-verde-gris">{url}</span>
        <span className="text-subtitulo leading-snug text-verde">{recortar(titulo, 60)}</span>
        <span className="text-pequeno text-verde-gris">{recortar(descripcion, 160)}</span>
      </div>
    </figure>
  );
}
