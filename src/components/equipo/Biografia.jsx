'use client';

import { useId, useRef } from 'react';
import { IconoCerrar } from '@/components/ui/Iconos';
import { interfaz } from '@/content/es/interfaz';

/**
 * Biografía larga en un modal accesible (§5.4). El <dialog> nativo con showModal() atrapa el
 * foco, cierra con Escape y lo devuelve al botón que lo abrió (§12).
 *
 * @param {{ nombre: string, parrafos: string[] }} props
 */
export default function Biografia({ nombre, parrafos }) {
  const dialogo = useRef(null);
  const idTitulo = useId();
  const t = interfaz.equipo;

  return (
    <>
      <button
        type="button"
        onClick={() => dialogo.current?.showModal()}
        aria-haspopup="dialog"
        className="group inline-flex min-h-11 presionable items-center gap-1.5 self-start font-medium text-verde"
      >
        <span className="subrayado-animado">{t.leerBiografia}</span>
        <span
          aria-hidden="true"
          className="text-oro transition-transform duration-(--duracion-micro) ease-estandar group-hover:translate-x-0.5"
        >
          ›
        </span>
      </button>

      <dialog
        ref={dialogo}
        aria-labelledby={idTitulo}
        // Clic en el fondo (fuera del panel) cierra el modal.
        onClick={(e) => e.target === dialogo.current && dialogo.current.close()}
        className="m-auto max-h-[85dvh] w-[min(42rem,calc(100%-2rem))] overflow-y-auto rounded-contenedor bg-marfil p-0 text-verde backdrop:bg-verde/50"
      >
        <div className="flex flex-col gap-6 p-6 sm:p-10">
          <div className="flex items-start justify-between gap-6">
            <h2 id={idTitulo} className="font-titulo text-subtitulo">
              <span className="sr-only">{t.biografiaDe} </span>
              {nombre}
            </h2>
            <button
              type="button"
              onClick={() => dialogo.current?.close()}
              aria-label={t.cerrarBiografia}
              className="-mt-2 -mr-2 inline-flex size-11 shrink-0 presionable items-center justify-center rounded-pildora"
            >
              <IconoCerrar />
            </button>
          </div>
          {parrafos.map((p) => (
            <p key={p.slice(0, 32)} className="max-w-prose">
              {p}
            </p>
          ))}
        </div>
      </dialog>
    </>
  );
}
