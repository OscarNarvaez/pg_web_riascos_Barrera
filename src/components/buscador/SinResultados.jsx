'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import EnlaceSecundario from '@/components/ui/EnlaceSecundario';
import { rutas } from '@/config/rutas';
import { textosBuscador as t } from '@/content/es/publicaciones';
import { etiquetasPopulares } from '@/lib/busqueda';

/**
 * Temas sugeridos (etiquetas con contenido publicado) y, si hubo una búsqueda sin resultados, el
 * mensaje de A.8 con salida a Contacto (§5.6: estado vacío útil).
 * @param {{ termino?: string, alElegir?: () => void }} props
 */
export default function SinResultados({ termino, alElegir }) {
  const [etiquetas, setEtiquetas] = useState([]);

  useEffect(() => {
    let vigente = true;
    etiquetasPopulares()
      .then((lista) => vigente && setEtiquetas(lista))
      .catch(() => {});
    return () => {
      vigente = false;
    };
  }, []);

  return (
    <div className="flex flex-col gap-5">
      {termino && (
        <div className="flex flex-col gap-2">
          <p className="font-titulo text-subtitulo text-verde">{t.sinResultados(termino)}</p>
          <p className="text-verde-gris">
            {etiquetas.length > 0 ? t.sinResultadosAyuda : t.sinResultadosAyudaSinTemas}
          </p>
        </div>
      )}
      {etiquetas.length > 0 && (
        <div className="flex flex-col gap-3">
          {!termino && (
            <p className="text-pequeno font-medium text-verde-gris">{t.temasSugeridos}</p>
          )}
          <ul className="flex flex-wrap gap-2">
            {etiquetas.map((e) => (
              <li key={e.slug}>
                <Link
                  href={`/publicaciones/etiqueta/${e.slug}/`}
                  onClick={alElegir}
                  className="inline-flex min-h-11 presionable items-center rounded-pildora border border-verde/20 px-4 text-pequeno font-medium text-verde hover:border-verde"
                >
                  {e.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {termino && (
        <EnlaceSecundario href={rutas.contacto}>{t.sinResultadosContacto}</EnlaceSecundario>
      )}
    </div>
  );
}
