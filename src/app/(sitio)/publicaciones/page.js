import PaginaListado from '@/components/publicaciones/PaginaListado';
import { textosPublicaciones as t } from '@/content/es/publicaciones';
import { obtenerContenido, paginar } from '@/lib/contenido';

export const metadata = { title: t.titulo, description: t.entradilla };

/** Publicaciones, página 1 (§5.5). */
export default async function Publicaciones() {
  const { publicaciones, etiquetas } = await obtenerContenido();
  const paginas = paginar(publicaciones);
  return (
    <PaginaListado
      titulo={t.titulo}
      entradilla={t.entradilla}
      publicaciones={paginas.pagina(1)}
      etiquetas={etiquetas}
      hayCasos={publicaciones.some((p) => p.tipo === 'caso')}
      filtro="todas"
      paginacion={{ actual: 1, total: paginas.total }}
    />
  );
}
