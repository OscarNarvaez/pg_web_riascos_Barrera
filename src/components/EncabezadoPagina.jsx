/**
 * Encabezado de las páginas interiores: el único h1 de la página (§10), una entradilla
 * opcional y, debajo, la imagen de portada si la página la tiene.
 *
 * @param {{ titulo: string, entradilla?: string, children?: import('react').ReactNode }} props
 */
export default function EncabezadoPagina({ titulo, entradilla, children }) {
  return (
    <header className="contenedor-amplio flex flex-col gap-10 pt-[calc(8rem+env(safe-area-inset-top))] pb-16 sm:gap-14 lg:pt-[calc(10rem+env(safe-area-inset-top))]">
      <div className="flex flex-col gap-6">
        <h1 className="font-titulo text-display text-verde">{titulo}</h1>
        {entradilla && (
          <p className="max-w-[40ch] font-titulo text-subtitulo text-verde-gris">{entradilla}</p>
        )}
      </div>
      {children}
    </header>
  );
}
