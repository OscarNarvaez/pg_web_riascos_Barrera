import { notFound } from 'next/navigation';
import PaginaListado from '@/components/publicaciones/PaginaListado';
import TarjetaLectura from '@/components/publicaciones/TarjetaLectura';
import { textosLecturas, textosPublicaciones as t } from '@/content/es/publicaciones';
import { RESERVA } from '@/config/publicaciones';
import { obtenerContenido } from '@/lib/contenido';

export const dynamicParams = false;

/** Solo etiquetas con al menos un contenido publicado (§5.5). */
export async function generateStaticParams() {
  const { etiquetas } = await obtenerContenido();
  return (etiquetas.length ? etiquetas : [{ slug: RESERVA }]).map((e) => ({ slug: e.slug }));
}

async function datos(slug) {
  const { publicaciones, lecturas, etiquetas } = await obtenerContenido();
  const etiqueta = etiquetas.find((e) => e.slug === slug);
  if (!etiqueta) return null;
  const tiene = (item) => item.etiquetas.some((e) => e.slug === slug);
  return {
    etiqueta,
    etiquetas,
    publicaciones: publicaciones.filter(tiene),
    lecturas: lecturas.filter(tiene),
    hayCasos: publicaciones.some((p) => p.tipo === 'caso'),
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = await datos(slug);
  return d
    ? { title: t.etiquetaTitulo(d.etiqueta.name), description: d.etiqueta.description ?? undefined }
    : {};
}

/** Publicaciones y lecturas recomendadas de una etiqueta (§5.5): comparten el sistema de etiquetas. */
export default async function PaginaEtiqueta({ params }) {
  const { slug } = await params;
  const d = await datos(slug);
  if (!d) notFound();

  return (
    <PaginaListado
      titulo={t.etiquetaTitulo(d.etiqueta.name)}
      entradilla={d.etiqueta.description ?? undefined}
      publicaciones={d.publicaciones}
      etiquetas={d.etiquetas}
      hayCasos={d.hayCasos}
      filtro={slug}
      despues={
        d.lecturas.length > 0 && (
          <section aria-labelledby="lecturas" className="flex flex-col gap-6 pt-8">
            <h2 id="lecturas" className="font-titulo text-titulo text-verde">
              {textosLecturas.titulo}
            </h2>
            <div>
              {d.lecturas.map((l) => (
                <TarjetaLectura key={l.id} lectura={l} nivel="h3" />
              ))}
            </div>
          </section>
        )
      }
    />
  );
}
