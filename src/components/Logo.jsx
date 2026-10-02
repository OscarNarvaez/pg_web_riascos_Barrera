import { conBase } from '@/lib/sitio';

/**
 * Logotipos oficiales (especificación §9.7), usados tal cual: sin recolorear ni deformar.
 * Las dimensiones intrínsecas evitan saltos de diseño; el tamaño visible lo fija `className`
 * por altura, y el ancho se deriva de la proporción original.
 */
const LOGOS = {
  horizontal: { archivo: 'logoHorizontal_R_B.webp', ancho: 580, alto: 221 },
  escudo: { archivo: 'logoR_B.webp', ancho: 322, alto: 393 },
};

/**
 * @param {{ variante?: keyof typeof LOGOS, className?: string, alt?: string, prioritario?: boolean }} props
 */
export default function Logo({
  variante = 'horizontal',
  className = 'h-10 w-auto',
  alt = 'Riascos & Barrera',
  prioritario = false,
}) {
  const logo = LOGOS[variante];
  return (
    <img
      src={conBase(`/logos/${logo.archivo}`)}
      width={logo.ancho}
      height={logo.alto}
      alt={alt}
      className={className}
      loading={prioritario ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
