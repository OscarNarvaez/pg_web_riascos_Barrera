'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { clientePanel } from '@/lib/panel/cliente';
import { codigoDeError } from '@/lib/panel/errores';

/**
 * @typedef {{ id: string, full_name: string, job_title: string | null, role: 'admin' | 'editor' }} Perfil
 * @typedef {{
 *   fase: 'cargando' | 'sin-sesion' | 'sin-perfil' | 'error' | 'con-sesion',
 *   usuario: import('@supabase/supabase-js').User | null,
 *   perfil: Perfil | null,
 *   esAdmin: boolean,
 *   saliendo: boolean,
 *   cerrarSesion: (motivo?: 'inactividad' | 'salida') => Promise<void>,
 *   recargarPerfil: () => void,
 * }} Sesion
 */

const Contexto = createContext(/** @type {Sesion | null} */ (null));

/** @returns {Sesion} */
export function useSesion() {
  const sesion = useContext(Contexto);
  if (!sesion) throw new Error('useSesion debe usarse dentro de ProveedorSesion.');
  return sesion;
}

/**
 * Sesión del panel (§7.1): usuario de Supabase Auth y su perfil con el rol. La interfaz oculta lo
 * que el rol no puede usar; quien lo impide de verdad es RLS.
 */
export default function ProveedorSesion({ children }) {
  const router = useRouter();
  const [estado, setEstado] = useState({ fase: 'cargando', usuario: null, perfil: null });
  const [version, setVersion] = useState(0);
  // Mientras se cierra la sesión a propósito, la guardia no redirige por su cuenta: la salida
  // lleva al ingreso con su motivo (por ejemplo, inactividad) y no con ?volver=.
  const [saliendo, setSaliendo] = useState(false);
  // La misma bandera en una referencia, para las cargas de perfil que terminan durante la salida.
  const saliendoRef = useRef(false);

  useEffect(() => {
    const cliente = clientePanel();
    let vigente = true;

    async function cargar(usuario) {
      if (!usuario) {
        if (vigente) setEstado({ fase: 'sin-sesion', usuario: null, perfil: null });
        return;
      }
      const { data, error } = await cliente
        .from('profiles')
        .select('id, full_name, job_title, role')
        .eq('id', usuario.id)
        .maybeSingle();
      // Una carga que termina mientras se cierra la sesión ya no es válida.
      if (!vigente || saliendoRef.current) return;
      if (error) {
        setEstado({
          fase: codigoDeError(error) === 'red' ? 'error' : 'sin-perfil',
          usuario,
          perfil: null,
        });
      } else {
        setEstado({ fase: data ? 'con-sesion' : 'sin-perfil', usuario, perfil: data });
      }
    }

    const { data } = cliente.auth.onAuthStateChange((evento, sesion) => {
      if (evento === 'TOKEN_REFRESHED') return;
      // Un ingreso nuevo después de una salida vuelve a habilitar la carga del perfil.
      if (evento === 'SIGNED_IN' && saliendoRef.current && sesion) {
        saliendoRef.current = false;
        setSaliendo(false);
      }
      // Supabase recomienda no llamar a la API dentro de este callback: se difiere.
      setTimeout(() => cargar(sesion?.user ?? null), 0);
    });
    return () => {
      vigente = false;
      data.subscription.unsubscribe();
    };
  }, [version]);

  const cerrarSesion = useCallback(
    async (motivo) => {
      saliendoRef.current = true;
      setSaliendo(true);
      await clientePanel().auth.signOut({ scope: 'local' });
      router.replace(`/panel/ingresar/${motivo ? `?motivo=${motivo}` : ''}`);
    },
    [router],
  );

  const recargarPerfil = useCallback(() => setVersion((v) => v + 1), []);

  const valor = useMemo(
    () => ({
      ...estado,
      esAdmin: estado.perfil?.role === 'admin',
      saliendo,
      cerrarSesion,
      recargarPerfil,
    }),
    [estado, saliendo, cerrarSesion, recargarPerfil],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
