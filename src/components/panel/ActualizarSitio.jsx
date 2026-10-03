'use client';

import { useState } from 'react';
import Boton from '@/components/ui/Boton';
import { errores, sitio } from '@/content/es/panel';
import { invocarFuncion } from '@/lib/panel/cliente';
import Aviso from './ui/Aviso';

/**
 * Pide a GitHub que recompile y despliegue el sitio (§3.5) mediante la Edge Function
 * reconstruir-sitio. Devuelve el código de error, si lo hubo.
 * @returns {Promise<string | null>}
 */
export async function recompilarSitio() {
  const { error } = await invocarFuncion('reconstruir-sitio');
  return error ?? null;
}

/**
 * Botón "Actualizar el sitio ahora" (§3.5 y §7.2).
 * @param {{ compacto?: boolean }} props
 */
export default function ActualizarSitio({ compacto = false }) {
  const [estado, setEstado] = useState(/** @type {'listo' | 'enviando' | 'hecho'} */ ('listo'));
  const [error, setError] = useState('');

  async function actualizar() {
    setEstado('enviando');
    setError('');
    const codigo = await recompilarSitio();
    setEstado(codigo ? 'listo' : 'hecho');
    if (codigo) setError(errores[codigo] ?? errores.desconocido);
  }

  return (
    <div className="flex flex-col items-start gap-3">
      <Boton
        variante={compacto ? 'contorno' : 'principal'}
        tamano={compacto ? 'compacto' : 'normal'}
        onClick={actualizar}
        disabled={estado === 'enviando'}
      >
        {estado === 'enviando' ? sitio.solicitando : sitio.boton}
      </Boton>
      {estado === 'hecho' && <Aviso tipo="exito">{sitio.solicitado}</Aviso>}
      <Aviso tipo="error">{error}</Aviso>
    </div>
  );
}
