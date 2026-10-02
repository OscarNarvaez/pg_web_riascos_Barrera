import Link from 'next/link';
import { firma } from '@/config/firma';
import { rutas } from '@/config/rutas';
import { textosLecturas, textosPublicaciones as t } from '@/content/es/publicaciones';
import EtiquetasEnlazadas from './EtiquetasEnlazadas';

const pastilla =
  'presionable inline-flex min-h-11 items-center rounded-pildora px-4 text-pequeno font-medium text-verde aria-[current=page]:bg-verde aria-[current=page]:text-marfil';

/**
 * Filtros por tipo y por etiqueta (§5.5). Cada filtro es una página estática.
 * @param {{ actual: 'todas' | 'casos' | string, etiquetas: import('@/lib/contenido').Etiqueta[], hayCasos: boolean }} props
 */
export default function FiltrosPublicaciones({ actual, etiquetas, hayCasos }) {
  return (
    <nav aria-label={t.filtros} className="flex flex-col gap-4">
      <ul className="flex flex-wrap gap-1">
        <li>
          <Link
            href={rutas.publicaciones}
            aria-current={actual === 'todas' ? 'page' : undefined}
            className={pastilla}
          >
            {t.todas}
          </Link>
        </li>
        {hayCasos && (
          <li>
            <Link
              href="/publicaciones/casos/"
              aria-current={actual === 'casos' ? 'page' : undefined}
              className={pastilla}
            >
              {firma.nombreSeccionCasos}
            </Link>
          </li>
        )}
        <li>
          <Link href={rutas.lecturas} className={pastilla}>
            {textosLecturas.titulo}
          </Link>
        </li>
      </ul>
      <EtiquetasEnlazadas etiquetas={etiquetas} actual={actual} etiqueta={t.etiquetas} />
    </nav>
  );
}
