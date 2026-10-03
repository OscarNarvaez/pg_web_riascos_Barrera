import MarcoSitio from '@/components/navegacion/MarcoSitio';
import RespaldoPublicacion from '@/components/publicaciones/RespaldoPublicacion';
import Boton from '@/components/ui/Boton';
import EnlaceSecundario from '@/components/ui/EnlaceSecundario';
import { rutas } from '@/config/rutas';
import { interfaz } from '@/content/es/interfaz';

export const metadata = { title: interfaz.noEncontrada.titulo, robots: { index: false } };

/**
 * Página 404 (§5.9 y Anexo A.8): dice qué pasó y qué hacer, sin disculparse. Si la ruta es la de
 * una publicación recién creada, el respaldo la carga desde Supabase (§3.5). Se renderiza fuera
 * de los grupos de rutas: lleva su propio armazón.
 */
export default function NoEncontrada() {
  const t = interfaz.noEncontrada;
  return (
    <MarcoSitio>
      <RespaldoPublicacion>
        <section className="contenedor-lectura flex min-h-[80svh] flex-col justify-center gap-8 pt-[calc(8rem+env(safe-area-inset-top))] pb-(--espacio-seccion)">
          <h1 className="max-w-[18ch] font-titulo text-titulo text-verde">{t.titulo}</h1>
          <p className="max-w-prose text-subtitulo text-verde-gris">{t.texto}</p>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
            <Boton href={rutas.inicio}>{t.inicio}</Boton>
            <EnlaceSecundario href={rutas.publicaciones}>{t.publicaciones}</EnlaceSecundario>
            <EnlaceSecundario href={rutas.contacto}>{t.contacto}</EnlaceSecundario>
          </div>
        </section>
      </RespaldoPublicacion>
    </MarcoSitio>
  );
}
