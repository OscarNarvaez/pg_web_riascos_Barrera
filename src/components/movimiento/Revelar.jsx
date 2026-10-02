'use client';

import * as m from 'motion/react-m';
import { EASE_SALIDA } from './curvas';

/**
 * Entrada secuenciada del hero (momento 1, §9.6): subtítulo y botones después del titular.
 * No es para el resto del contenido: §9.6 prohíbe la animación de entrada en cada bloque.
 *
 * @param {{ retraso?: number, className?: string, children: import('react').ReactNode }} props
 */
export default function Revelar({ retraso = 0, className = '', children }) {
  return (
    <m.div
      data-revelar=""
      className={className}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE_SALIDA, delay: retraso }}
    >
      {children}
    </m.div>
  );
}
