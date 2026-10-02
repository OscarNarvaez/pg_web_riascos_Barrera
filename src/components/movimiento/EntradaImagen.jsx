'use client';

import * as m from 'motion/react-m';
import { EASE_SALIDA } from './curvas';

/**
 * Momento 1 (§9.6): la imagen del hero pasa de escala 1,06 a 1 en unos 1,6 s.
 * El contenedor recorta, así que el tamaño ocupado no cambia y no hay desplazamiento de diseño.
 *
 * @param {{ className?: string, children: import('react').ReactNode }} props
 */
export default function EntradaImagen({ className = '', children }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <m.div
        data-revelar=""
        initial={{ scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: EASE_SALIDA }}
      >
        {children}
      </m.div>
    </div>
  );
}
