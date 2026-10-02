'use client';

import { useRef } from 'react';
import { useScroll, useTransform } from 'motion/react';
import * as m from 'motion/react-m';

/** Numeral que pasa de verde-gris a oro cuando la línea lo alcanza. */
function Numeral({ progreso, indice, total, numero }) {
  const umbral = indice / total;
  const opacity = useTransform(progreso, [Math.max(0, umbral - 0.04), umbral + 0.04], [0, 1]);
  return (
    <span className="relative font-titulo text-titulo tabular-nums">
      <span className="text-verde-gris">{numero}</span>
      <m.span
        aria-hidden="true"
        data-resaltado=""
        className="absolute inset-0 text-oro"
        style={{ opacity }}
      >
        {numero}
      </m.span>
    </span>
  );
}

/**
 * Momento 4 (§9.6): línea de progreso oro que se completa a medida que se recorren los pasos.
 * Es el filete del sitio llevado a su función. Solo se anima `scaleY`.
 *
 * @param {{ pasos: { numero: string, titulo: string, texto: string }[], className?: string }} props
 */
export default function LineaProgreso({ pasos, className = '' }) {
  const lista = useRef(null);
  const { scrollYProgress } = useScroll({ target: lista, offset: ['start 0.6', 'end 0.6'] });
  const total = pasos.length;

  return (
    <ol ref={lista} className={`relative flex flex-col gap-16 pl-8 sm:pl-12 ${className}`}>
      <span aria-hidden="true" className="absolute top-0 bottom-0 left-0 w-px bg-verde/15" />
      <m.span
        aria-hidden="true"
        data-progreso=""
        className="absolute top-0 bottom-0 left-0 w-px origin-top bg-oro"
        style={{ scaleY: scrollYProgress }}
      />
      {pasos.map((paso, i) => (
        <li key={paso.numero} className="flex flex-col gap-3">
          <Numeral progreso={scrollYProgress} indice={i} total={total} numero={paso.numero} />
          <h3 className="font-titulo text-subtitulo text-verde">{paso.titulo}</h3>
          <p className="max-w-prose text-verde-gris">{paso.texto}</p>
        </li>
      ))}
    </ol>
  );
}
