import { Suspense } from 'react';
import SoloAdmin from '@/components/panel/sesion/SoloAdmin';
import DetalleContacto from '@/components/panel/contactos/DetalleContacto';
import { contactos } from '@/content/es/panel';

export const metadata = { title: contactos.tituloDetalle };

export default function PaginaContactosDetalle() {
  return (
    <SoloAdmin>
      <Suspense>
        <DetalleContacto />
      </Suspense>
    </SoloAdmin>
  );
}
