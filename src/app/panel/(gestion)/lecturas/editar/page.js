import { Suspense } from 'react';
import EditorLectura from '@/components/panel/lecturas/EditorLectura';
import { lecturas } from '@/content/es/panel';

export const metadata = { title: lecturas.tituloEditar };

export default function PaginaLecturasEditar() {
  return (
    <Suspense>
      <EditorLectura />
    </Suspense>
  );
}
