import Link from 'next/link';
import { rutas } from '@/config/rutas';
import { textosPublicaciones as t } from '@/content/es/publicaciones';

const url = (n) => (n === 1 ? rutas.publicaciones : `/publicaciones/pagina/${n}/`);

/**
 * Paginación estática del listado (§5.5): /publicaciones/ y /publicaciones/pagina/{n}/.
 * @param {{ actual: number, total: number }} props
 */
export default function Paginacion({ actual, total }) {
  if (total <= 1) return null;
  return (
    <nav
      aria-label={t.paginacion}
      className="flex items-center justify-between gap-6 border-t border-oro pt-6"
    >
      {actual > 1 ? (
        <Link
          href={url(actual - 1)}
          rel="prev"
          className="subrayado-animado inline-flex min-h-11 items-center font-medium text-verde"
        >
          {t.anterior}
        </Link>
      ) : (
        <span />
      )}
      <p className="text-pequeno text-verde-gris">{t.pagina(actual, total)}</p>
      {actual < total ? (
        <Link
          href={url(actual + 1)}
          rel="next"
          className="subrayado-animado inline-flex min-h-11 items-center font-medium text-verde"
        >
          {t.siguiente}
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
