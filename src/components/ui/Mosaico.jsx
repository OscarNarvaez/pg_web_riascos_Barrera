import Link from 'next/link';

/**
 * Mosaico del bento (§9.1): sin sombras; la jerarquía la dan el tamaño, el color y el espacio.
 * Todo el mosaico es el enlace. El texto va en verde: verde-gris sobre el tinte de oliva cae
 * a 4,2:1 y no cumple AA (ver src/lib/contraste.test.js).
 *
 * @param {object} props
 * @param {string} props.href
 * @param {string} props.titulo
 * @param {string} [props.texto]
 * @param {import('react').ReactNode} [props.children] Contenido adicional, por ejemplo una imagen.
 * @param {string} [props.className] Ubicación en la rejilla (col-span, row-span).
 */
export default function Mosaico({ href, titulo, texto, children, className = '' }) {
  return (
    <Link
      href={href}
      className={`group flex presionable flex-col gap-4 overflow-hidden rounded-mosaico bg-oliva/15 p-6 sm:p-8 ${className}`}
    >
      <span className="flex items-start justify-between gap-4">
        <span className="font-titulo text-subtitulo text-verde">{titulo}</span>
        <span
          aria-hidden="true"
          className="pt-1 text-subtitulo text-oro transition-transform duration-(--duracion-micro) ease-estandar group-hover:translate-x-0.5"
        >
          ›
        </span>
      </span>
      {texto && <span className="max-w-prose text-verde">{texto}</span>}
      {children}
    </Link>
  );
}
