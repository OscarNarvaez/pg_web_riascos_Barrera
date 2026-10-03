'use client';

import { useId, useRef, useState } from 'react';

/**
 * Pestañas accesibles (patrón WAI-ARIA): flechas para cambiar de pestaña, Inicio y Fin para ir a
 * los extremos. Los paneles inactivos se ocultan sin desmontarse, para no perder lo escrito.
 *
 * @param {{ etiqueta: string, pestanas: { id: string, titulo: string, contenido: import('react').ReactNode }[] }} props
 */
export default function Pestanas({ etiqueta, pestanas }) {
  const [activa, setActiva] = useState(pestanas[0].id);
  const base = useId();
  const botones = useRef(/** @type {Record<string, HTMLButtonElement | null>} */ ({}));

  /** @param {import('react').KeyboardEvent} e */
  function alTeclear(e) {
    const indice = pestanas.findIndex((p) => p.id === activa);
    const destinos = {
      ArrowRight: (indice + 1) % pestanas.length,
      ArrowLeft: (indice - 1 + pestanas.length) % pestanas.length,
      Home: 0,
      End: pestanas.length - 1,
    };
    if (!(e.key in destinos)) return;
    e.preventDefault();
    const destino = pestanas[destinos[e.key]].id;
    setActiva(destino);
    botones.current[destino]?.focus();
  }

  return (
    <div className="flex flex-col gap-8">
      <div role="tablist" aria-label={etiqueta} className="flex gap-1 border-b border-verde/15">
        {pestanas.map((p) => {
          const seleccionada = p.id === activa;
          return (
            <button
              key={p.id}
              ref={(el) => {
                botones.current[p.id] = el;
              }}
              type="button"
              role="tab"
              id={`${base}-${p.id}-pestana`}
              aria-selected={seleccionada}
              aria-controls={`${base}-${p.id}-panel`}
              tabIndex={seleccionada ? 0 : -1}
              onClick={() => setActiva(p.id)}
              onKeyDown={alTeclear}
              className={`-mb-px min-h-11 border-b-2 px-4 font-medium ${
                seleccionada
                  ? 'border-oro text-verde'
                  : 'border-transparent text-verde-gris hover:text-verde'
              }`}
            >
              {p.titulo}
            </button>
          );
        })}
      </div>
      {pestanas.map((p) => (
        <div
          key={p.id}
          role="tabpanel"
          id={`${base}-${p.id}-panel`}
          aria-labelledby={`${base}-${p.id}-pestana`}
          hidden={p.id !== activa}
          className="flex flex-col gap-6"
        >
          {p.contenido}
        </div>
      ))}
    </div>
  );
}
