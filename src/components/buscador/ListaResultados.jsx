import Link from 'next/link';
import { firma } from '@/config/firma';
import {
  textosBuscador as t,
  textosLecturas,
  textosPublicaciones,
} from '@/content/es/publicaciones';
import { destinoDe, trozosDeFragmento } from '@/lib/busqueda';
import { formatearFecha } from '@/lib/fechas';

const TIPO = {
  articulo: textosPublicaciones.articulo,
  caso: firma.nombreSeccionCasos,
  lectura: t.lectura,
};

/** Fragmento con las coincidencias resaltadas, construido como elementos (sin HTML). */
function Fragmento({ texto }) {
  return (
    <p className="line-clamp-3 text-verde-gris">
      {trozosDeFragmento(texto).map((trozo, i) =>
        trozo.marcado ? (
          <mark key={i} className="bg-oro/25 text-verde">
            {trozo.texto}
          </mark>
        ) : (
          trozo.texto
        ),
      )}
    </p>
  );
}

/**
 * Resultados de búsqueda: tipo, fecha, título enlazado y fragmento resaltado (§5.6).
 * @param {{ resultados: import('@/lib/busqueda').Resultado[], alElegir?: () => void }} props
 */
export default function ListaResultados({ resultados, alElegir }) {
  return (
    <ul className="flex flex-col">
      {resultados.map((r) => {
        const externo = r.tipo === 'lectura';
        const contenido = (
          <>
            <span className="subrayado-animado">{r.titulo}</span>
            {externo && <span className="sr-only"> {textosLecturas.abreEnOtraPestana}</span>}
          </>
        );
        return (
          <li
            key={`${r.tipo}-${r.id}`}
            className="flex flex-col gap-2 border-t border-verde/15 py-5"
          >
            <p className="flex flex-wrap gap-x-2 text-pequeno text-verde-gris">
              <span>{TIPO[r.tipo]}</span>
              {r.fuente && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{r.fuente}</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <time dateTime={r.fecha}>{formatearFecha(r.fecha)}</time>
            </p>
            <h3 className="font-titulo text-subtitulo text-verde">
              {externo ? (
                <a
                  href={destinoDe(r)}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  onClick={alElegir}
                >
                  {contenido}
                </a>
              ) : (
                <Link href={destinoDe(r)} onClick={alElegir}>
                  {contenido}
                </Link>
              )}
            </h3>
            {r.fragmento && <Fragmento texto={r.fragmento} />}
          </li>
        );
      })}
    </ul>
  );
}
