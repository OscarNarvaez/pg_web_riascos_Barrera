'use client';

import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Boton from '@/components/ui/Boton';
import { rutasPanel } from '@/config/panel';
import { errores, ingreso, panel } from '@/content/es/panel';
import { useInactividad } from '@/hooks/useInactividad';
import { BASE_PATH } from '@/lib/sitio';
import MarcoPanel from '../MarcoPanel';
import Aviso from '../ui/Aviso';
import { useSesion } from './ProveedorSesion';

/** Pantalla mínima mientras se resuelve la sesión, o cuando no hay acceso. */
function PantallaSimple({ children }) {
  return (
    <main
      id="contenido"
      className="flex min-h-dvh flex-col items-center justify-center gap-6 px-(--margen-lateral) text-center"
    >
      {children}
    </main>
  );
}

/**
 * Protege las secciones del panel: sin sesión, lleva al ingreso y recuerda a dónde volver.
 * Con sesión, aplica el cierre por inactividad (§7.1) y muestra el armazón.
 */
export default function Guardia({ children }) {
  const sesion = useSesion();
  const { fase, saliendo, cerrarSesion, recargarPerfil } = sesion;
  const router = useRouter();

  useEffect(() => {
    if (fase !== 'sin-sesion' || saliendo) return;
    const ruta = window.location.pathname.slice(BASE_PATH.length) + window.location.search;
    router.replace(`${rutasPanel.ingresar}?volver=${encodeURIComponent(ruta)}`);
  }, [fase, saliendo, router]);

  const alVencer = useCallback(() => cerrarSesion('inactividad'), [cerrarSesion]);
  useInactividad(fase === 'con-sesion', alVencer);

  if (fase === 'con-sesion') return <MarcoPanel>{children}</MarcoPanel>;

  if (fase === 'sin-perfil') {
    return (
      <PantallaSimple>
        <p className="max-w-prose">{ingreso.sinPerfil}</p>
        <Boton onClick={() => cerrarSesion()}>{panel.cerrarSesion}</Boton>
      </PantallaSimple>
    );
  }

  if (fase === 'error') {
    return (
      <PantallaSimple>
        <Aviso tipo="error">{errores.red}</Aviso>
        <Boton onClick={recargarPerfil}>{panel.reintentar}</Boton>
      </PantallaSimple>
    );
  }

  return (
    <PantallaSimple>
      <p role="status" className="text-verde-gris">
        {panel.cargando}
      </p>
    </PantallaSimple>
  );
}
