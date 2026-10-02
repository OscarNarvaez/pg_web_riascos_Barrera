import Imagen from '@/components/Imagen';
import Mosaico from '@/components/ui/Mosaico';
import { rutas } from '@/config/rutas';
import { areas } from '@/content/es/areas';
import { inicio } from '@/content/es/inicio';

// Derecho Público es el mosaico mayor: A.4.2 lo define como el núcleo de la operación.
const UBICACION = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-2',
  'md:col-span-1',
  'md:col-span-1',
];

/** 5 · Áreas de práctica (§5.1): bento de tamaños distintos, cada mosaico enlaza a su ancla. */
export default function AreasMosaico() {
  return (
    <section aria-labelledby="areas" className="espacio-seccion">
      <div className="contenedor-amplio flex flex-col gap-12">
        <h2 id="areas" className="max-w-4xl font-titulo text-titulo text-verde">
          {inicio.areas.titulo}
        </h2>
        <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
          {areas.map((area, i) => (
            <Mosaico
              key={area.ancla}
              href={`${rutas.areas}#${area.ancla}`}
              titulo={area.nombre}
              texto={area.resumen}
              className={UBICACION[i]}
            >
              {i === 0 && (
                <Imagen
                  nombre={area.imagen}
                  alt=""
                  className="mt-auto rounded-control"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              )}
            </Mosaico>
          ))}
        </div>
      </div>
    </section>
  );
}
