/**
 * Mensaje de estado del panel. Los errores se anuncian de inmediato (role="alert"); los demás,
 * sin interrumpir (role="status"). La paleta no tiene rojo (§9.2): el error se distingue por el
 * filete y el tinte de oro, y por su texto, nunca solo por el color.
 *
 * @param {{ tipo?: 'info' | 'exito' | 'error', children: import('react').ReactNode, className?: string }} props
 */
export default function Aviso({ tipo = 'info', children, className = '' }) {
  if (!children) return null;
  const estilo =
    tipo === 'error' ? 'border-l-4 border-oro bg-oro/15' : 'border-l-4 border-verde/30 bg-oliva/15';
  return (
    <div
      role={tipo === 'error' ? 'alert' : 'status'}
      className={`rounded-control px-4 py-3 text-verde ${estilo} ${className}`}
    >
      {children}
    </div>
  );
}
