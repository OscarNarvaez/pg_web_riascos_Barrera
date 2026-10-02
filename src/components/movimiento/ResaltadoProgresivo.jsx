'use client';

import { useRef } from 'react';
import { useScroll } from 'motion/react';
import * as m from 'motion/react-m';

/**
 * Una línea que pasa de verde-gris a verde al cruzar el centro de la pantalla.
 * Se superponen dos capas y solo se anima la opacidad de la verde (§9.6 solo permite
 * transform, opacity y filter). El estado inicial, verde-gris, ya cumple AA (4,8:1).
 */
function Linea({ texto, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    // De 0 a 1 mientras el centro de la línea recorre el 15 % central de la ventana.
    offset: ['center 0.575', 'center 0.425'],
  });
  return (
    <li ref={ref} className={`relative ${className}`}>
      <span className="text-verde-gris">{texto}</span>
      <m.span
        aria-hidden="true"
        data-resaltado=""
        className="absolute inset-0 text-verde"
        style={{ opacity: scrollYProgress }}
      >
        {texto}
      </m.span>
    </li>
  );
}

/**
 * Momento 2 (§9.6): resaltado progresivo de una lista, como en apple.com.
 * @param {{ lineas: string[], className?: string, claseLinea?: string }} props
 */
export default function ResaltadoProgresivo({ lineas, className = '', claseLinea = '' }) {
  return (
    <ul className={className}>
      {lineas.map((texto) => (
        <Linea key={texto} texto={texto} className={claseLinea} />
      ))}
    </ul>
  );
}
