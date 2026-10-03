import { Suspense } from 'react';
import Restablecer from '@/components/panel/acceso/Restablecer';
import { restablecer } from '@/content/es/panel';

export const metadata = { title: restablecer.tituloSolicitar };

export default function PaginaRestablecer() {
  return (
    <Suspense>
      <Restablecer />
    </Suspense>
  );
}
