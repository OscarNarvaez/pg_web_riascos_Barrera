import { Suspense } from 'react';
import FormularioIngreso from '@/components/panel/acceso/FormularioIngreso';
import { ingreso } from '@/content/es/panel';

export const metadata = { title: ingreso.titulo };

export default function PaginaIngresar() {
  return (
    <Suspense>
      <FormularioIngreso />
    </Suspense>
  );
}
