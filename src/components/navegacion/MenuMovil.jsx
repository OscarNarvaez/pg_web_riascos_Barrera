'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { AnimatePresence } from 'motion/react';
import * as m from 'motion/react-m';
import Logo from '@/components/Logo';
import Boton from '@/components/ui/Boton';
import { IconoCerrar, IconoLupa } from '@/components/ui/Iconos';
import { EASE_ESTANDAR, DURACION } from '@/components/movimiento/curvas';
import { navegacionPrincipal, rutas } from '@/config/rutas';
import { interfaz } from '@/content/es/interfaz';
import { useDialogo } from '@/hooks/useDialogo';

const transicion = { duration: DURACION.interfaz, ease: EASE_ESTANDAR };

/**
 * Menú móvil a pantalla completa (§4.3), con vidrio (§9.1) y trampa de foco (§12).
 * Entra con un fundido y un desplazamiento de 16 px (momento 6, §9.6).
 *
 * @param {{ abierto: boolean, cerrar: () => void, actual: string, abrirBuscador: () => void }} props
 */
export default function MenuMovil({ abierto, cerrar, actual, abrirBuscador }) {
  const ref = useRef(null);
  useDialogo(ref, abierto, cerrar);
  const { navegacion: n, acciones } = interfaz;

  return (
    <AnimatePresence>
      {abierto && (
        <m.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={n.principal}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto vidrio-denso pt-[env(safe-area-inset-top)] pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transicion}
        >
          <div className="contenedor-amplio flex h-18 shrink-0 items-center justify-between">
            <Link href={rutas.inicio} onClick={cerrar} className="flex min-h-11 items-center">
              <Logo variante="escudo" className="h-9 w-auto min-[400px]:hidden" />
              <Logo className="h-9 w-auto max-[399px]:hidden" />
            </Link>
            <button
              type="button"
              onClick={cerrar}
              aria-label={n.cerrarMenu}
              className="inline-flex size-11 presionable items-center justify-center rounded-pildora text-verde"
            >
              <IconoCerrar />
            </button>
          </div>

          <m.nav
            aria-label={n.principal}
            className="contenedor-amplio flex flex-1 flex-col justify-center gap-10 py-8"
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            exit={{ y: 16 }}
            transition={transicion}
          >
            <ul className="flex flex-col gap-2">
              {navegacionPrincipal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={cerrar}
                    aria-current={actual.startsWith(item.href) ? 'page' : undefined}
                    className="inline-flex min-h-11 items-center font-titulo text-titulo text-verde aria-[current=page]:text-verde-gris"
                  >
                    {item.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={abrirBuscador}
              className="inline-flex min-h-11 presionable items-center gap-3 self-start font-medium text-verde"
            >
              <IconoLupa />
              {n.buscar}
            </button>
          </m.nav>

          <div className="contenedor-amplio shrink-0">
            <Boton href={rutas.consulta} anchoCompleto onClick={cerrar}>
              {acciones.agendeConsulta}
            </Boton>
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
