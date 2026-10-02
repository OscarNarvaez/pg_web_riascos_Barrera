import Imagen from '@/components/Imagen';
import ResaltadoProgresivo from '@/components/movimiento/ResaltadoProgresivo';
import { inicio } from '@/content/es/inicio';

/**
 * 2 · Qué hacemos (§5.1). Las cuatro lógicas se iluminan una a una con el desplazamiento
 * (momento 2 de §9.6). En escritorio, la imagen queda fija mientras se lee.
 */
export default function QueHacemos() {
  const t = inicio.queHacemos;
  return (
    <section aria-labelledby="que-hacemos" className="espacio-seccion">
      <div className="contenedor-amplio grid gap-10 lg:grid-cols-2 lg:gap-x-20">
        <header className="flex flex-col gap-6 lg:col-start-2">
          <h2 id="que-hacemos" className="font-titulo text-titulo text-verde">
            {t.titulo}
          </h2>
          <p className="max-w-prose text-verde-gris">{t.introduccion}</p>
        </header>
        <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
          <div className="lg:sticky lg:top-28">
            <Imagen
              nombre="inicio-que-hacemos"
              alt=""
              className="rounded-contenedor"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
        </div>
        <div className="flex flex-col gap-10 lg:col-start-2">
          <ResaltadoProgresivo
            lineas={t.logicas}
            className="flex flex-col gap-3 sm:gap-4"
            claseLinea="font-titulo text-subtitulo"
          />
          <p className="font-editorial text-subtitulo text-verde">{t.cierre}</p>
        </div>
      </div>
    </section>
  );
}
