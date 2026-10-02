'use client';

import { useId } from 'react';

/**
 * Casilla de verificación con etiqueta (por ejemplo, el consentimiento de §8.3, que nunca va
 * marcada por defecto). El área táctil cubre la casilla y la etiqueta.
 *
 * @param {{ nombre: string, children: import('react').ReactNode, error?: string, obligatorio?: boolean }} props
 */
export default function Casilla({ nombre, children, error, obligatorio = false, ...resto }) {
  const id = useId();
  const idError = `${id}-error`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex min-h-11 cursor-pointer items-start gap-3 text-verde">
        <input
          id={id}
          name={nombre}
          type="checkbox"
          required={obligatorio}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? idError : undefined}
          className="mt-1 size-5 shrink-0 accent-verde"
          {...resto}
        />
        <span>{children}</span>
      </label>
      <p id={idError} aria-live="polite" className="text-pequeno font-medium text-verde">
        {error}
      </p>
    </div>
  );
}
