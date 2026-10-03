/**
 * Título de una sección del panel con sus acciones principales.
 * @param {{ titulo: string, children?: import('react').ReactNode, antes?: import('react').ReactNode }} props
 */
export default function EncabezadoSeccion({ titulo, children, antes }) {
  return (
    <header className="flex flex-col gap-4">
      {antes}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-titulo text-titulo text-verde">{titulo}</h1>
        {children && <div className="flex flex-wrap items-center gap-3">{children}</div>}
      </div>
    </header>
  );
}
