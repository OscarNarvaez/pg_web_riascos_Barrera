'use client';

import * as m from 'motion/react-m';
import { EASE_SALIDA } from './curvas';

/**
 * Momento 1 (§9.6): el titular aparece por palabras, con opacidad, desenfoque de 8 px a 0 y
 * desplazamiento de 24 px, 80 ms entre palabras.
 * Los lectores de pantalla leen el texto completo; las palabras animadas están ocultas para ellos.
 *
 * @param {{ texto: string, como?: 'h1'|'h2'|'p', className?: string, retraso?: number }} props
 */
export default function TitularPorPalabras({
  texto,
  como: Etiqueta = 'h1',
  className = '',
  retraso = 0,
}) {
  const palabras = texto.split(' ');
  return (
    <Etiqueta className={className}>
      <span className="sr-only">{texto}</span>
      <span aria-hidden="true">
        {palabras.map((palabra, i) => (
          <m.span
            key={`${palabra}-${i}`}
            data-revelar=""
            className="inline-block whitespace-pre"
            initial={{ opacity: 0, filter: 'blur(8px)', y: 24 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.9, ease: EASE_SALIDA, delay: retraso + i * 0.08 }}
          >
            {palabra}
            {i < palabras.length - 1 ? ' ' : ''}
          </m.span>
        ))}
      </span>
    </Etiqueta>
  );
}
