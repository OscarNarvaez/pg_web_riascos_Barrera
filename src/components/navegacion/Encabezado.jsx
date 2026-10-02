'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import Boton from '@/components/ui/Boton';
import { IconoLupa, IconoMenu } from '@/components/ui/Iconos';
import { navegacionPrincipal, rutas } from '@/config/rutas';
import { interfaz } from '@/content/es/interfaz';
import { useDesplazamiento } from '@/hooks/useDesplazamiento';
import CapaBuscador from './CapaBuscador';
import MenuMovil from './MenuMovil';

const TRANSICION = 'transition-transform duration-(--duracion-interfaz) ease-estandar';

/** @param {string} actual @param {string} href */
const esActual = (actual, href) => actual === href || actual.startsWith(href);

/**
 * Encabezado con vidrio translúcido (§4.3, §9.1 y momento 5 de §9.6).
 * Escritorio: se compacta de 72 a 56 px al desplazarse. Móvil: se oculta al bajar y reaparece
 * al subir. El botón "Agende su consulta" está visible en todos los anchos.
 */
export default function Encabezado() {
  const { compacto, oculto } = useDesplazamiento();
  const [menu, setMenu] = useState(false);
  const [buscador, setBuscador] = useState(false);
  const actual = usePathname() ?? '/';
  const cerrarMenu = useCallback(() => setMenu(false), []);
  const cerrarBuscador = useCallback(() => setBuscador(false), []);
  const { navegacion: n, acciones } = interfaz;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 pt-[env(safe-area-inset-top)] ${TRANSICION}`}
        style={{ transform: oculto && !menu ? 'translateY(-100%)' : 'translateY(0)' }}
      >
        <div
          aria-hidden="true"
          className={`absolute inset-0 border-b vidrio ${TRANSICION}`}
          style={{ transform: compacto ? 'translateY(-16px)' : 'translateY(0)' }}
        />
        <div
          className={`relative contenedor-amplio flex h-18 items-center justify-between gap-4 ${TRANSICION}`}
          style={{ transform: compacto ? 'translateY(-8px)' : 'translateY(0)' }}
        >
          <Link
            href={rutas.inicio}
            className={`flex min-h-11 origin-left items-center ${TRANSICION}`}
            style={{ transform: compacto ? 'scale(0.88)' : 'scale(1)' }}
          >
            {/* Por debajo de 400 px no caben el logotipo horizontal, la píldora y el menú: se
                usa el escudo, que es también un logotipo oficial (plan de diseño §5). */}
            <Logo variante="escudo" className="h-9 w-auto min-[400px]:hidden" prioritario />
            <Logo className="h-9 w-auto max-[399px]:hidden lg:h-10" prioritario />
          </Link>

          <nav aria-label={n.principal} className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {navegacionPrincipal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={esActual(actual, item.href) ? 'page' : undefined}
                    className="subrayado-animado inline-flex min-h-11 items-center text-pequeno font-medium text-verde"
                  >
                    {item.etiqueta}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setBuscador(true)}
              aria-label={n.buscar}
              aria-haspopup="dialog"
              className="hidden size-11 presionable items-center justify-center rounded-pildora text-verde lg:inline-flex"
            >
              <IconoLupa />
            </button>
            <Boton href={rutas.consulta} tamano="compacto">
              {acciones.agendeConsulta}
            </Boton>
            <button
              type="button"
              onClick={() => setMenu(true)}
              aria-label={n.abrirMenu}
              aria-haspopup="dialog"
              aria-expanded={menu}
              className="inline-flex size-11 presionable items-center justify-center rounded-pildora text-verde lg:hidden"
            >
              <IconoMenu />
            </button>
          </div>
        </div>
      </header>

      <MenuMovil
        abierto={menu}
        cerrar={cerrarMenu}
        actual={actual}
        abrirBuscador={() => {
          setMenu(false);
          setBuscador(true);
        }}
      />
      <CapaBuscador abierto={buscador} cerrar={cerrarBuscador} />
    </>
  );
}
