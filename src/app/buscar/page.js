import { Suspense } from 'react';
import PaginaBuscar from '@/components/buscador/PaginaBuscar';
import { textosBuscador as t } from '@/content/es/publicaciones';

// noindex: la página de resultados no debe indexarse (§5.6).
export const metadata = { title: t.titulo, robots: { index: false, follow: true } };

/** Resultados del buscador (§5.6). Página estática; los resultados llegan en el navegador. */
export default function Buscar() {
  return (
    <section className="contenedor-lectura flex flex-col gap-10 pt-[calc(8rem+env(safe-area-inset-top))] pb-(--espacio-seccion) lg:pt-[calc(10rem+env(safe-area-inset-top))]">
      <h1 className="font-titulo text-display text-verde">{t.titulo}</h1>
      <Suspense>
        <PaginaBuscar />
      </Suspense>
    </section>
  );
}
