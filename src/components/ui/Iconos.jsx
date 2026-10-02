/**
 * Íconos de interfaz dibujados para el sitio (no son íconos de Apple, §9.1).
 * Trazo de 1,5 px en el color del texto; siempre decorativos: el control lleva su etiqueta.
 */
const base = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  'aria-hidden': true,
  focusable: false,
};

export function IconoLupa(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </svg>
  );
}

export function IconoMenu(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 9h16M4 15h16" />
    </svg>
  );
}

export function IconoCerrar(props) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
