import Link from 'next/link';

const VARIANTES = {
  // Píldora verde con texto marfil, para superficies claras.
  principal: 'bg-verde text-marfil hover:bg-verde/90',
  // Invertida, para secciones en verde profundo.
  invertido: 'bg-marfil text-verde hover:bg-marfil/90',
};

const TAMANOS = {
  normal: 'min-h-12 px-6 text-cuerpo',
  compacto: 'min-h-11 px-4 text-pequeno',
};

/**
 * Botón en forma de píldora (plan de diseño §3). Sin flechas: el chevrón queda para los
 * enlaces secundarios. Con `href` se renderiza como enlace.
 *
 * @param {object} props
 * @param {string} [props.href]
 * @param {keyof typeof VARIANTES} [props.variante]
 * @param {keyof typeof TAMANOS} [props.tamano]
 * @param {boolean} [props.anchoCompleto]
 * @param {string} [props.className]
 * @param {import('react').ReactNode} props.children
 */
export default function Boton({
  href,
  variante = 'principal',
  tamano = 'normal',
  anchoCompleto = false,
  className = '',
  children,
  ...resto
}) {
  const clases = [
    'presionable inline-flex items-center justify-center rounded-pildora font-medium whitespace-nowrap',
    VARIANTES[variante],
    TAMANOS[tamano],
    anchoCompleto ? 'w-full' : '',
    className,
  ].join(' ');

  if (href) {
    return (
      <Link href={href} className={clases} {...resto}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" className={clases} {...resto}>
      {children}
    </button>
  );
}
