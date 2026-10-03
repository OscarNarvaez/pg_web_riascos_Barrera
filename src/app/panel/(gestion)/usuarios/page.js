import SoloAdmin from '@/components/panel/sesion/SoloAdmin';
import GestionUsuarios from '@/components/panel/usuarios/GestionUsuarios';
import { usuarios } from '@/content/es/panel';

export const metadata = { title: usuarios.titulo };

export default function PaginaUsuarios() {
  return (
    <SoloAdmin>
      <GestionUsuarios />
    </SoloAdmin>
  );
}
