import EncabezadoPagina from '@/components/EncabezadoPagina';
import { textosPublicaciones as t } from '@/content/es/publicaciones';
import FiltrosPublicaciones from './FiltrosPublicaciones';
import Paginacion from './Paginacion';
import TarjetaPublicacion from './TarjetaPublicacion';

/**
 * Listado de publicaciones (§5.5): más recientes primero, filtros por tipo y etiqueta.
 *
 * @param {object} props
 * @param {string} props.titulo
 * @param {string} [props.entradilla]
 * @param {import('react').ReactNode} [props.aviso] Por ejemplo, el aviso de los casos.
 * @param {import('@/lib/contenido').Publicacion[]} props.publicaciones
 * @param {import('@/lib/contenido').Etiqueta[]} props.etiquetas
 * @param {boolean} props.hayCasos
 * @param {string} props.filtro
 * @param {{ actual: number, total: number }} [props.paginacion]
 * @param {import('react').ReactNode} [props.despues] Contenido tras el listado.
 */
export default function PaginaListado({
  titulo,
  entradilla,
  aviso,
  publicaciones,
  etiquetas,
  hayCasos,
  filtro,
  paginacion,
  despues,
}) {
  return (
    <>
      <EncabezadoPagina titulo={titulo} entradilla={entradilla} />
      <div className="contenedor-amplio flex flex-col gap-14 pb-(--espacio-seccion)">
        {aviso}
        <FiltrosPublicaciones actual={filtro} etiquetas={etiquetas} hayCasos={hayCasos} />
        {publicaciones.length > 0 ? (
          <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {publicaciones.map((p) => (
              <TarjetaPublicacion key={p.id} publicacion={p} />
            ))}
          </div>
        ) : (
          <p className="text-subtitulo text-verde-gris">{t.sinPublicaciones}</p>
        )}
        {paginacion && <Paginacion {...paginacion} />}
        {despues}
      </div>
    </>
  );
}
