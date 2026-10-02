'use client';

import { useRef, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import PanelBusqueda from '@/components/buscador/PanelBusqueda';
import EnlaceSecundario from '@/components/ui/EnlaceSecundario';
import { IconoCerrar, IconoLupa } from '@/components/ui/Iconos';
import { EASE_ESTANDAR, DURACION } from '@/components/movimiento/curvas';
import { rutas } from '@/config/rutas';
import { textosBuscador as t } from '@/content/es/publicaciones';
import { useDialogo } from '@/hooks/useDialogo';
import { conBase } from '@/lib/sitio';

const transicion = { duration: DURACION.interfaz, ease: EASE_ESTANDAR };

/**
 * Capa del buscador a pantalla completa (§5.6): resultados en vivo con retardo de 250 ms,
 * temas sugeridos y enlace a /buscar/?q= con todos los resultados.
 * @param {{ abierto: boolean, cerrar: () => void }} props
 */
export default function CapaBuscador({ abierto, cerrar }) {
  const ref = useRef(null);
  const [consulta, setConsulta] = useState('');
  useDialogo(ref, abierto, cerrar);
  const urlCompleta = `${rutas.buscar}?q=${encodeURIComponent(consulta.trim())}`;

  return (
    <AnimatePresence>
      {abierto && (
        <m.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-buscador"
          className="fixed inset-0 z-50 overflow-y-auto vidrio-denso pt-[env(safe-area-inset-top)] pb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transicion}
        >
          <div className="contenedor-amplio flex h-18 items-center justify-end">
            <button
              type="button"
              onClick={cerrar}
              aria-label={t.cerrar}
              className="inline-flex size-11 presionable items-center justify-center rounded-pildora text-verde"
            >
              <IconoCerrar />
            </button>
          </div>
          <m.div
            className="contenedor-lectura flex flex-col gap-8 pt-[6svh]"
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            exit={{ y: 16 }}
            transition={transicion}
          >
            <h2 id="titulo-buscador" className="sr-only">
              {t.titulo}
            </h2>
            <form role="search" action={conBase(rutas.buscar)} method="get">
              <label className="flex items-center gap-4 border-b border-verde/20 pb-3 focus-within:border-oro">
                <span className="sr-only">{t.campo}</span>
                <IconoLupa className="shrink-0 text-verde-gris" />
                <input
                  data-foco-inicial=""
                  type="search"
                  name="q"
                  value={consulta}
                  onChange={(e) => setConsulta(e.target.value)}
                  autoComplete="off"
                  enterKeyHint="search"
                  placeholder={t.ejemplo}
                  className="w-full bg-transparent font-titulo text-subtitulo text-verde outline-none placeholder:text-verde-gris"
                />
              </label>
            </form>
            <PanelBusqueda
              consulta={consulta}
              limite={8}
              alElegir={cerrar}
              pie={<EnlaceSecundario href={urlCompleta}>{t.verTodos}</EnlaceSecundario>}
            />
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
