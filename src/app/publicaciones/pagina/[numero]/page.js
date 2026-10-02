import { notFound } from 'next/navigation';
import PaginaListado from '@/components/publicaciones/PaginaListado';
import { textosPublicaciones as t } from '@/content/es/publicaciones';
import { RESERVA } from '@/config/publicaciones';
import { obtenerContenido, paginar } from '@/lib/contenido';

export const dynamicParams = false;

/** Páginas 2 en adelante (§5.5). Sin ninguna, se genera la ruta de reserva (ver RESERVA). */
export async function generateStaticParams() {
  const { publicaciones } = await obtenerContenido();
  const { total } = paginar(publicaciones);
  const numeros = Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({
    numero: String(i + 2),
  }));
  return numeros.length ? numeros : [{ numero: RESERVA }];
}

export async function generateMetadata({ params }) {
  const { numero } = await params;
  return { title: `${t.titulo} · ${t.paginaN(Number(numero))}` };
}

export default async function PaginaPublicaciones({ params }) {
  const { numero } = await params;
  const n = Number(numero);
  const { publicaciones, etiquetas } = await obtenerContenido();
  const paginas = paginar(publicaciones);
  if (!Number.isInteger(n) || n < 2 || n > paginas.total) notFound();

  return (
    <PaginaListado
      titulo={t.titulo}
      entradilla={t.pagina(n, paginas.total)}
      publicaciones={paginas.pagina(n)}
      etiquetas={etiquetas}
      hayCasos={publicaciones.some((p) => p.tipo === 'caso')}
      filtro="todas"
      paginacion={{ actual: n, total: paginas.total }}
    />
  );
}
