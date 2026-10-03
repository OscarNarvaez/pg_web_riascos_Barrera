'use client';

import { useId } from 'react';
import { interfaz } from '@/content/es/interfaz';

/**
 * Campo de formulario accesible (§12): etiqueta visible, ayuda y error asociados al campo, y
 * error anunciado. Lo usan los formularios de la Fase 5.
 *
 * @param {object} props
 * @param {string} props.etiqueta
 * @param {string} props.nombre
 * @param {'text'|'email'|'tel'|'textarea'|'select'} [props.tipo]
 * @param {boolean} [props.obligatorio]
 * @param {string} [props.ayuda]
 * @param {string} [props.error] Mensaje que dice qué pasó y cómo corregirlo (§5.9).
 * @param {{ valor: string, etiqueta: string }[]} [props.opciones] Para tipo "select".
 */
export default function Campo({
  etiqueta,
  nombre,
  tipo = 'text',
  obligatorio = false,
  ayuda,
  error,
  opciones = [],
  ...resto
}) {
  const id = useId();
  const idAyuda = ayuda ? `${id}-ayuda` : undefined;
  const idError = `${id}-error`;
  const descrito = [idAyuda, error ? idError : null].filter(Boolean).join(' ') || undefined;

  const comunes = {
    id,
    name: nombre,
    required: obligatorio,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': descrito,
    className: `w-full rounded-control border bg-marfil px-4 py-3 text-verde placeholder:text-verde-gris ${
      error ? 'border-oro' : 'border-verde/20'
    }`,
    ...resto,
  };

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-medium text-verde">
        {etiqueta}
        {obligatorio && (
          <span className="text-verde-gris">
            {' '}
            <span aria-hidden="true">*</span>
            <span className="sr-only">({interfaz.formularios.obligatorio})</span>
          </span>
        )}
      </label>
      {ayuda && (
        <p id={idAyuda} className="text-pequeno [overflow-wrap:anywhere] text-verde-gris">
          {ayuda}
        </p>
      )}
      {tipo === 'textarea' ? (
        <textarea rows={5} {...comunes} />
      ) : tipo === 'select' ? (
        <select {...comunes}>
          {opciones.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.etiqueta}
            </option>
          ))}
        </select>
      ) : (
        <input type={tipo} {...comunes} />
      )}
      <p
        id={idError}
        aria-live="polite"
        className="min-h-[1lh] text-pequeno font-medium text-verde"
      >
        {error && (
          <>
            <span aria-hidden="true" className="mr-1.5 inline-block size-2 rounded-full bg-oro" />
            {error}
          </>
        )}
      </p>
    </div>
  );
}
