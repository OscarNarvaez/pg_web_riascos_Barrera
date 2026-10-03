import ListaLecturas from '@/components/panel/lecturas/ListaLecturas';
import { lecturas } from '@/content/es/panel';

export const metadata = { title: lecturas.titulo };

export default function PaginaLecturas() {
  return <ListaLecturas />;
}
