import EnlaceSecundario from '@/components/ui/EnlaceSecundario';
import TarjetaPublicacion from '@/components/publicaciones/TarjetaPublicacion';
import { RECIENTES_EN_INICIO } from '@/config/publicaciones';
import { rutas } from '@/config/rutas';
import { textosPublicaciones as t } from '@/content/es/publicaciones';
import { obtenerContenido } from '@/lib/contenido';

/** 11 · Publicaciones recientes (§5.1): las tres últimas. Si no hay ninguna, no se muestra. */
export default async function PublicacionesRecientes() {
  const { publicaciones } = await obtenerContenido();
  if (publicaciones.length === 0) return null;
  return (
    <section aria-labelledby="recientes" className="espacio-seccion">
      <div className="contenedor-amplio flex flex-col gap-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 id="recientes" className="font-titulo text-titulo text-verde">
            {t.titulo}
          </h2>
          <EnlaceSecundario href={rutas.publicaciones}>{t.todas}</EnlaceSecundario>
        </div>
        <div className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {publicaciones.slice(0, RECIENTES_EN_INICIO).map((p) => (
            <TarjetaPublicacion key={p.id} publicacion={p} nivel="h3" />
          ))}
        </div>
      </div>
    </section>
  );
}
