import SoloAdmin from '@/components/panel/sesion/SoloAdmin';
import ListaContactos from '@/components/panel/contactos/ListaContactos';
import { contactos } from '@/content/es/panel';

export const metadata = { title: contactos.titulo };

export default function PaginaContactos() {
  return (
    <SoloAdmin>
      <ListaContactos />
    </SoloAdmin>
  );
}
