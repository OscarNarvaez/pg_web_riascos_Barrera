'use client';

import { useEffect, useId, useRef } from 'react';
import { IconoCerrar } from '@/components/ui/Iconos';
import { panel } from '@/content/es/panel';

/**
 * Modal del panel sobre <dialog> nativo: showModal() atrapa el foco, cierra con Escape y lo
 * devuelve al control que lo abrió (§12).
 *
 * @param {{
 *   abierto: boolean, alCerrar: () => void, titulo: string, children: import('react').ReactNode,
 *   ancho?: 'normal' | 'amplio' | 'completo',
 * }} props
 */
export default function Dialogo({ abierto, alCerrar, titulo, children, ancho = 'normal' }) {
  const ref = useRef(/** @type {HTMLDialogElement | null} */ (null));
  const idTitulo = useId();

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (abierto && !dialogo.open) dialogo.showModal();
    if (!abierto && dialogo.open) dialogo.close();
  }, [abierto]);

  const anchos = {
    normal: 'w-[min(36rem,calc(100%-2rem))] max-h-[90dvh] rounded-contenedor',
    amplio: 'w-[min(56rem,calc(100%-2rem))] max-h-[90dvh] rounded-contenedor',
    completo: 'h-dvh max-h-none w-full max-w-none rounded-none',
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={idTitulo}
      // Escape y el clic en el fondo cierran; el estado lo controla quien abre el modal.
      onClose={alCerrar}
      onCancel={(e) => {
        e.preventDefault();
        alCerrar();
      }}
      onClick={(e) => e.target === ref.current && alCerrar()}
      className={`m-auto overflow-y-auto bg-marfil p-0 text-verde backdrop:bg-verde/50 ${anchos[ancho]}`}
    >
      {abierto && (
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <h2 id={idTitulo} className="font-titulo text-subtitulo">
              {titulo}
            </h2>
            <button
              type="button"
              onClick={alCerrar}
              aria-label={panel.cerrar}
              className="-mt-2 -mr-2 inline-flex size-11 shrink-0 presionable items-center justify-center rounded-pildora"
            >
              <IconoCerrar />
            </button>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}
