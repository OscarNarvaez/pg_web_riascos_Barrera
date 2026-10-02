import EncabezadoPagina from '@/components/EncabezadoPagina';
import EtiquetasEnlazadas from '@/components/publicaciones/EtiquetasEnlazadas';
import TarjetaLectura from '@/components/publicaciones/TarjetaLectura';
import { textosLecturas as t, textosPublicaciones } from '@/content/es/publicaciones';
import { obtenerContenido } from '@/lib/contenido';

export const metadata = { title: t.titulo };

/** Lecturas recomendadas (§5.5): sección aparte, no mezclada con las publicaciones propias. */
export default async function LecturasRecomendadas() {
  const { lecturas, etiquetas } = await obtenerContenido();
  return (
    <>
      <EncabezadoPagina titulo={t.titulo} />
      <div className="contenedor-lectura flex flex-col gap-10 pb-(--espacio-seccion)">
        <EtiquetasEnlazadas etiquetas={etiquetas} etiqueta={textosPublicaciones.etiquetas} />
        {lecturas.length > 0 ? (
          <div className="border-b border-oro">
            {lecturas.map((l) => (
              <TarjetaLectura key={l.id} lectura={l} />
            ))}
          </div>
        ) : (
          <p className="text-subtitulo text-verde-gris">{t.sinLecturas}</p>
        )}
      </div>
    </>
  );
}
