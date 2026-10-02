/**
 * Filete oro de 1 px: el único ornamento del sitio (plan de diseño, "La idea").
 * @param {{ className?: string }} props
 */
export default function Filete({ className = '' }) {
  return <div aria-hidden="true" className={`h-px w-full bg-oro ${className}`} />;
}
