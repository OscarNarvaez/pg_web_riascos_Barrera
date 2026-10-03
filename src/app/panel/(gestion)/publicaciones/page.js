import ListaPublicaciones from '@/components/panel/publicaciones/ListaPublicaciones';
import { publicaciones } from '@/content/es/panel';

export const metadata = { title: publicaciones.titulo };

export default function PaginaPublicaciones() {
  return <ListaPublicaciones />;
}
