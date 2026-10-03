import { Suspense } from 'react';
import EditorPublicacion from '@/components/panel/publicaciones/EditorPublicacion';
import { publicaciones } from '@/content/es/panel';

export const metadata = { title: publicaciones.tituloEditar };

/** Una sola ruta estática para crear y editar: el registro llega en ?id= (exportación estática). */
export default function PaginaEditarPublicacion() {
  return (
    <Suspense>
      <EditorPublicacion />
    </Suspense>
  );
}
