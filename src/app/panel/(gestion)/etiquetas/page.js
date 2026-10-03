import GestionEtiquetas from '@/components/panel/etiquetas/GestionEtiquetas';
import { etiquetas } from '@/content/es/panel';

export const metadata = { title: etiquetas.titulo };

export default function PaginaEtiquetas() {
  return <GestionEtiquetas />;
}
