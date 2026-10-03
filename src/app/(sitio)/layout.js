import MarcoSitio from '@/components/navegacion/MarcoSitio';

/** Páginas públicas: comparten barra, pie y movimiento. */
export default function LayoutSitio({ children }) {
  return <MarcoSitio>{children}</MarcoSitio>;
}
