import SoloAdmin from '@/components/panel/sesion/SoloAdmin';
import GestionReferentes from '@/components/panel/referentes/GestionReferentes';
import { referentes } from '@/content/es/panel';

export const metadata = { title: referentes.titulo };

export default function PaginaReferentes() {
  return (
    <SoloAdmin>
      <GestionReferentes />
    </SoloAdmin>
  );
}
