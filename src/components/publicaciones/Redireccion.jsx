import Link from 'next/link';
import { textosPublicaciones as t } from '@/content/es/publicaciones';
import { conBase } from '@/lib/sitio';

/**
 * Página en un slug anterior (§10). GitHub Pages no admite redirecciones de servidor: se usa
 * <meta http-equiv="refresh"> y la canónica apunta a la dirección nueva. React 19 lleva la
 * etiqueta <meta> al <head>.
 * @param {{ destino: string, titulo: string }} props
 */
export default function Redireccion({ destino, titulo }) {
  return (
    <section className="contenedor-lectura flex min-h-[70svh] flex-col justify-center gap-6 pt-[calc(8rem+env(safe-area-inset-top))] pb-(--espacio-seccion)">
      <meta httpEquiv="refresh" content={`0; url=${conBase(destino)}`} />
      <h1 className="font-titulo text-titulo text-verde">{t.redireccion}</h1>
      <p className="text-verde-gris">{titulo}</p>
      <Link href={destino} className="subrayado-animado self-start font-medium text-verde">
        {t.irALaNueva}
      </Link>
    </section>
  );
}
