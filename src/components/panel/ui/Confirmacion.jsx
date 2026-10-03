'use client';

import Boton from '@/components/ui/Boton';
import { panel } from '@/content/es/panel';
import Aviso from './Aviso';
import Dialogo from './Dialogo';

/**
 * Confirmación de una acción delicada: despublicar, enviar a la papelera, eliminar.
 *
 * @param {{
 *   abierto: boolean, alCerrar: () => void, titulo: string, texto?: string,
 *   confirmar: string, alConfirmar: () => void, ocupado?: boolean, deshabilitado?: boolean,
 *   error?: string, children?: import('react').ReactNode,
 * }} props
 */
export default function Confirmacion({
  abierto,
  alCerrar,
  titulo,
  texto,
  confirmar,
  alConfirmar,
  ocupado = false,
  deshabilitado = false,
  error,
  children,
}) {
  return (
    <Dialogo abierto={abierto} alCerrar={alCerrar} titulo={titulo}>
      {texto && <p className="max-w-prose">{texto}</p>}
      {children}
      <Aviso tipo="error">{error}</Aviso>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Boton variante="contorno" onClick={alCerrar}>
          {panel.cancelar}
        </Boton>
        <Boton onClick={alConfirmar} disabled={ocupado || deshabilitado}>
          {ocupado ? panel.guardando : confirmar}
        </Boton>
      </div>
    </Dialogo>
  );
}
