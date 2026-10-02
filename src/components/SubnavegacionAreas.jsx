'use client';

import { useEffect, useState } from 'react';
import { interfaz } from '@/content/es/interfaz';

/**
 * Subnavegación fija de Áreas de Práctica (§5.3): resalta el área que cruza el centro de la
 * pantalla. Vidrio, porque es un control flotante (§9.1).
 *
 * @param {{ areas: { ancla: string, nombre: string }[] }} props
 */
export default function SubnavegacionAreas({ areas }) {
  const [activa, setActiva] = useState(null);

  useEffect(() => {
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          const id = e.target.id;
          // Al salir de la franja central, el área deja de estar activa (si no la relevó otra).
          setActiva((actual) => (e.isIntersecting ? id : actual === id ? null : actual));
        }
      },
      // Solo cuenta la franja central de la ventana.
      { rootMargin: '-45% 0px -50% 0px' },
    );
    for (const { ancla } of areas) {
      const el = document.getElementById(ancla);
      if (el) observador.observe(el);
    }
    return () => observador.disconnect();
  }, [areas]);

  return (
    <nav
      aria-label={interfaz.areas.subnavegacion}
      className="sticky top-[calc(0.75rem+env(safe-area-inset-top))] z-30 lg:top-[calc(4.25rem+env(safe-area-inset-top))]"
    >
      <div className="contenedor-amplio">
        <ul className="flex [scrollbar-width:none] gap-1 overflow-x-auto rounded-pildora border vidrio p-1 sm:inline-flex">
          {areas.map(({ ancla, nombre }) => (
            <li key={ancla} className="shrink-0">
              <a
                href={`#${ancla}`}
                aria-current={activa === ancla ? 'location' : undefined}
                className="inline-flex min-h-11 presionable items-center rounded-pildora px-4 text-pequeno font-medium text-verde aria-[current=location]:bg-verde aria-[current=location]:text-marfil"
              >
                {nombre}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
