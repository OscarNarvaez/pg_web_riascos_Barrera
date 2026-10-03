'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Boton from '@/components/ui/Boton';
import Campo from '@/components/ui/Campo';
import { rutasPanel } from '@/config/panel';
import { errores, ingreso } from '@/content/es/panel';
import { clientePanel } from '@/lib/panel/cliente';
import { codigoDeErrorAuth } from '@/lib/panel/errores';
import { registrarActividad } from '@/lib/panel/inactividad';
import Aviso from '../ui/Aviso';
import { useSesion } from '../sesion/ProveedorSesion';

/**
 * Destino tras ingresar: solo rutas internas del panel, para que el parámetro no pueda llevar a
 * otro sitio (redirección abierta).
 * @param {string | null} volver
 */
export function destinoSeguro(volver) {
  return volver && /^\/panel\/[\w\-/?=&%.]*$/.test(volver) && !volver.startsWith('//')
    ? volver
    : rutasPanel.tablero;
}

/** Ingreso con correo y contraseña (§7.1). */
export default function FormularioIngreso() {
  const router = useRouter();
  const parametros = useSearchParams();
  const { fase } = useSesion();
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const destino = destinoSeguro(parametros.get('volver'));
  const motivo = parametros.get('motivo');

  useEffect(() => {
    // Sin perfil también se navega: la guardia del panel explica que la cuenta no tiene acceso.
    if (fase === 'con-sesion' || fase === 'sin-perfil') router.replace(destino);
  }, [fase, destino, router]);

  /** @param {import('react').FormEvent<HTMLFormElement>} e */
  async function enviar(e) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    setEnviando(true);
    setError('');
    const { error: fallo } = await clientePanel().auth.signInWithPassword({
      email: String(datos.get('email') ?? '').trim(),
      password: String(datos.get('password') ?? ''),
    });
    if (fallo) {
      setError(errores[codigoDeErrorAuth(fallo)] ?? errores.desconocido);
      setEnviando(false);
      return;
    }
    // La navegación la hace el efecto de arriba cuando el perfil ya cargó: navegar ahora haría
    // que la guardia del panel viera todavía "sin sesión" y devolviera al ingreso.
    registrarActividad();
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-titulo text-titulo text-verde">{ingreso.titulo}</h1>
      {motivo === 'inactividad' && <Aviso>{ingreso.inactividad}</Aviso>}
      {motivo === 'salida' && <Aviso>{ingreso.salida}</Aviso>}
      <form onSubmit={enviar} className="flex flex-col gap-2">
        <Campo
          etiqueta={ingreso.correo}
          nombre="email"
          tipo="email"
          autoComplete="username"
          obligatorio
        />
        <Campo
          etiqueta={ingreso.contrasena}
          nombre="password"
          tipo="password"
          autoComplete="current-password"
          obligatorio
        />
        <Aviso tipo="error" className="mb-4">
          {error}
        </Aviso>
        <Boton type="submit" disabled={enviando} anchoCompleto>
          {enviando ? ingreso.ingresando : ingreso.ingresar}
        </Boton>
      </form>
      <Link
        href={rutasPanel.restablecer}
        className="flex min-h-11 items-center self-start text-verde underline underline-offset-4"
      >
        {ingreso.olvido}
      </Link>
    </div>
  );
}
