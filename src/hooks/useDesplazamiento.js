'use client';

import { useEffect, useState } from 'react';

const UMBRAL_COMPACTO = 24;
const UMBRAL_OCULTAR = 80;

/**
 * Estado de la barra según el desplazamiento (momento 5, §9.6).
 * - `compacto`: se desplazó más de 24 px.
 * - `oculto`: solo en pantallas menores de 1024 px, al bajar; reaparece al subir.
 *   Con movimiento reducido nunca se oculta.
 * Se calcula una vez por fotograma.
 */
export function useDesplazamiento() {
  const [estado, setEstado] = useState({ compacto: false, oculto: false });

  useEffect(() => {
    const movil = window.matchMedia('(max-width: 1023px)');
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)');
    let anterior = window.scrollY;
    let pendiente = false;

    function actualizar() {
      pendiente = false;
      const y = window.scrollY;
      const bajando = y > anterior;
      const puedeOcultar = movil.matches && !reducido.matches && y > UMBRAL_OCULTAR;
      setEstado((e) => {
        const compacto = y > UMBRAL_COMPACTO;
        const oculto =
          Math.abs(y - anterior) < 4 ? e.oculto && puedeOcultar : puedeOcultar && bajando;
        return e.compacto === compacto && e.oculto === oculto ? e : { compacto, oculto };
      });
      anterior = y;
    }

    function alDesplazar() {
      if (!pendiente) {
        pendiente = true;
        requestAnimationFrame(actualizar);
      }
    }

    actualizar();
    window.addEventListener('scroll', alDesplazar, { passive: true });
    return () => window.removeEventListener('scroll', alDesplazar);
  }, []);

  return estado;
}
