import Tablero from '@/components/panel/Tablero';
import { tablero } from '@/content/es/panel';

export const metadata = { title: tablero.titulo };

export default function PaginaTablero() {
  return <Tablero />;
}
