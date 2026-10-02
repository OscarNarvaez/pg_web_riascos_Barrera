import { firma } from '@/config/firma';
import { textosPublicaciones as t } from '@/content/es/publicaciones';
import { formatearFecha } from '@/lib/fechas';

/**
 * Tipo, fecha, autor y minutos de lectura (§5.5).
 * @param {{ publicacion: import('@/lib/contenido').Publicacion, conAutor?: boolean }} props
 */
export default function MetaPublicacion({ publicacion: p, conAutor = false }) {
  const partes = [
    p.tipo === 'caso' ? firma.nombreSeccionCasos : t.articulo,
    <time key="fecha" dateTime={p.fecha}>
      {formatearFecha(p.fecha)}
    </time>,
    conAutor && p.autor ? `${t.por} ${p.autor}` : null,
    t.minutosDeLectura(p.minutos),
  ].filter(Boolean);
  return (
    <p className="flex flex-wrap gap-x-2 text-pequeno text-verde-gris">
      {partes.map((parte, i) => (
        <span key={i} className="flex gap-x-2">
          {i > 0 && <span aria-hidden="true">·</span>}
          {parte}
        </span>
      ))}
    </p>
  );
}
