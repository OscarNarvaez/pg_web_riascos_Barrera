import { panel } from '@/content/es/panel';

/**
 * Estado de un contenido. Se distingue por texto y forma, no solo por color (§12).
 * @param {{ estado: keyof typeof panel.estados }} props
 */
export default function Insignia({ estado }) {
  const estilos = {
    publicada: 'bg-verde text-marfil',
    programada: 'border border-verde text-verde',
    borrador: 'bg-oliva/20 text-verde',
    papelera: 'border border-dashed border-verde/40 text-verde',
  };
  return (
    <span
      className={`inline-flex items-center rounded-pildora px-3 py-0.5 text-pequeno font-medium whitespace-nowrap ${estilos[estado]}`}
    >
      {panel.estados[estado]}
    </span>
  );
}
