import Link from 'next/link';

/**
 * Etiquetas enlazadas a su página (§5.5).
 * @param {{ etiquetas: import('@/lib/contenido').Etiqueta[], actual?: string, etiqueta?: string }} props
 */
export default function EtiquetasEnlazadas({ etiquetas, actual, etiqueta }) {
  if (!etiquetas.length) return null;
  return (
    <ul aria-label={etiqueta} className="flex flex-wrap gap-2">
      {etiquetas.map((e) => (
        <li key={e.slug}>
          <Link
            href={`/publicaciones/etiqueta/${e.slug}/`}
            aria-current={actual === e.slug ? 'page' : undefined}
            className="inline-flex min-h-11 presionable items-center rounded-pildora border border-verde/20 px-4 text-pequeno font-medium text-verde hover:border-verde aria-[current=page]:border-verde aria-[current=page]:bg-verde aria-[current=page]:text-marfil"
          >
            {e.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
