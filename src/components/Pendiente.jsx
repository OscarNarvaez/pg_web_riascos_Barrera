import {
  descripcionPendiente,
  esPendiente,
  formatearPendiente,
  MOSTRAR_PENDIENTES,
} from '@/lib/pendientes';

/**
 * Renderiza `children` solo si `valor` es un dato confirmado (especificación §14.4).
 * Si es un marcador pendiente: en desarrollo muestra el marcador resaltado; en producción
 * no renderiza nada, de modo que el elemento que lo contiene desaparece.
 *
 * @param {{ valor: unknown, children: import('react').ReactNode | ((valor: any) => import('react').ReactNode) }} props
 */
export default function Pendiente({ valor, children }) {
  if (esPendiente(valor)) {
    if (!MOSTRAR_PENDIENTES) return null;
    return (
      <span className="marcador-pendiente" data-pendiente="">
        {formatearPendiente(descripcionPendiente(valor))}
      </span>
    );
  }
  return typeof children === 'function' ? children(valor) : children;
}
