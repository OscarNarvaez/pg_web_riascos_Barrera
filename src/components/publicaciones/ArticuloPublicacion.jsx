import { firma } from '@/config/firma';
import { textosPublicaciones as t } from '@/content/es/publicaciones';
import AvisoCasos from './AvisoCasos';
import Compartir from './Compartir';
import EtiquetasEnlazadas from './EtiquetasEnlazadas';
import MetaPublicacion from './MetaPublicacion';
import Portada from './Portada';

/**
 * Detalle de una publicación (§5.5): título, fecha, autor, minutos, portada, cuerpo con
 * tipografía de lectura, etiquetas y compartir. Los casos llevan el aviso obligatorio al final.
 * El HTML llega ya saneado (src/lib/sanear.js). Lo usan la página estática y el respaldo de 404.
 *
 * @param {{ publicacion: import('@/lib/contenido').Publicacion, url: string, children?: import('react').ReactNode }} props
 */
export default function ArticuloPublicacion({ publicacion: p, url, children }) {
  return (
    <article className="flex flex-col gap-12 pt-[calc(8rem+env(safe-area-inset-top))] pb-(--espacio-seccion) lg:pt-[calc(10rem+env(safe-area-inset-top))]">
      <header className="contenedor-lectura flex flex-col gap-6">
        <MetaPublicacion publicacion={p} conAutor />
        <h1 className="font-titulo text-titulo text-verde">{p.titulo}</h1>
        {p.extracto && (
          <p className="font-editorial text-subtitulo text-verde-gris">{p.extracto}</p>
        )}
      </header>
      {/* Sin imagen no hay portada: la tipográfica repetiría el título que está justo arriba. */}
      {p.portada && (
        <div className="contenedor-amplio">
          <Portada
            publicacion={p}
            prioritaria
            sizes="(min-width: 1440px) 1320px, 100vw"
            className="rounded-contenedor"
          />
        </div>
      )}
      <div className="contenedor-lectura flex flex-col gap-12">
        <div className="prosa" dangerouslySetInnerHTML={{ __html: p.html }} />
        {p.tipo === 'caso' && <AvisoCasos />}
        <div className="flex flex-col gap-8 border-t border-oro pt-8">
          <EtiquetasEnlazadas
            etiquetas={p.etiquetas}
            etiqueta={`${t.etiquetas} · ${firma.nombre}`}
          />
          <Compartir url={url} titulo={p.titulo} />
        </div>
      </div>
      {children}
    </article>
  );
}
