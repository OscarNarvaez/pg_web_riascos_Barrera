'use client';

import { useId, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from '@/components/Logo';
import { IconoCerrar, IconoMenu } from '@/components/ui/Iconos';
import { navegacionPanel, rutasPanel } from '@/config/panel';
import { panel } from '@/content/es/panel';
import { useSesion } from './sesion/ProveedorSesion';

/**
 * Armazón del panel (§7.4): mismos tokens que el sitio, prioridad en la claridad. Barra lateral
 * fija en escritorio; en móvil, una barra superior con el menú desplegable.
 */
export default function MarcoPanel({ children }) {
  const { perfil, esAdmin, cerrarSesion } = useSesion();
  const ruta = usePathname() ?? '';
  const [menu, setMenu] = useState(false);
  const idMenu = useId();
  const enlaces = navegacionPanel.filter((e) => !e.soloAdmin || esAdmin);
  const esActual = (href) =>
    href === rutasPanel.tablero ? ruta === href || ruta === '/panel' : ruta.startsWith(href);

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <header className="border-b border-verde/10 bg-marfil lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-4 px-(--margen-lateral) pt-[calc(1rem+env(safe-area-inset-top))] pb-4 lg:px-6 lg:pt-8">
          <Link href={rutasPanel.tablero} className="flex min-h-11 flex-col justify-center gap-1">
            <Logo className="h-8 w-auto" prioritario />
            <span className="text-pequeno text-verde-gris">{panel.nombre}</span>
          </Link>
          <button
            type="button"
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            aria-controls={idMenu}
            aria-label={menu ? panel.cerrarMenu : panel.abrirMenu}
            className="inline-flex size-11 presionable items-center justify-center rounded-pildora lg:hidden"
          >
            {menu ? <IconoCerrar /> : <IconoMenu />}
          </button>
        </div>

        <div
          id={idMenu}
          className={`${menu ? 'flex' : 'hidden'} flex-col justify-between gap-8 px-3 pb-6 lg:flex lg:flex-1`}
        >
          <nav aria-label={panel.navegacion}>
            <ul className="flex flex-col gap-1">
              {enlaces.map((e) => {
                const actual = esActual(e.href);
                return (
                  <li key={e.href}>
                    <Link
                      href={e.href}
                      onClick={() => setMenu(false)}
                      aria-current={actual ? 'page' : undefined}
                      className={`flex min-h-11 items-center rounded-control px-3 font-medium ${
                        actual ? 'bg-verde text-marfil' : 'text-verde hover:bg-verde/5'
                      }`}
                    >
                      {e.etiqueta}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex flex-col gap-1 border-t border-verde/10 px-3 pt-6">
            <p className="font-medium text-verde">{perfil?.full_name || perfil?.role}</p>
            <p className="text-pequeno text-verde-gris">{panel.roles[perfil?.role ?? 'editor']}</p>
            <div className="mt-3 flex flex-col items-start">
              <Link
                href="/"
                className="flex min-h-11 items-center text-verde underline-offset-4 hover:underline"
              >
                {panel.verSitio}
              </Link>
              <button
                type="button"
                onClick={() => cerrarSesion('salida')}
                className="flex min-h-11 items-center text-verde underline-offset-4 hover:underline"
              >
                {panel.cerrarSesion}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main id="contenido" className="min-w-0 flex-1 px-(--margen-lateral) py-8 lg:px-10 lg:py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">{children}</div>
      </main>
    </div>
  );
}
