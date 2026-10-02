import Link from 'next/link';

/**
 * Enlace secundario con el chevrón "›" en oro (plan de diseño §3). Es la única "flecha" del
 * sitio. El texto se subraya al pasar el cursor y el chevrón avanza 2 px.
 *
 * @param {{ href: string, claro?: boolean, className?: string, children: import('react').ReactNode }} props
 */
export default function EnlaceSecundario({ href, claro = false, className = '', children }) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-11 items-center gap-1.5 font-medium ${
        claro ? 'text-marfil' : 'text-verde'
      } ${className}`}
    >
      <span className="subrayado-animado">{children}</span>
      <span
        aria-hidden="true"
        className="text-oro transition-transform duration-(--duracion-micro) ease-estandar group-hover:translate-x-0.5"
      >
        ›
      </span>
    </Link>
  );
}
