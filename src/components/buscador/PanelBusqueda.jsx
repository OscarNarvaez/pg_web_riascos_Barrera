'use client';

import { textosBuscador as t } from '@/content/es/publicaciones';
import ListaResultados from './ListaResultados';
import SinResultados from './SinResultados';
import { useBusqueda } from './useBusqueda';

/**
 * Estado de una búsqueda: buscando, error, resultados con conteo, o vacío útil (§5.6).
 * Lo comparten la capa superpuesta y la página /buscar/.
 * @param {{ consulta: string, limite: number, pie?: import('react').ReactNode, alElegir?: () => void }} props
 */
export default function PanelBusqueda({ consulta, limite, pie, alElegir }) {
  const { resultados, cargando, error, consulta: buscada } = useBusqueda(consulta, { limite });
  const termino = consulta.trim();

  let contenido;
  if (!termino) contenido = <SinResultados alElegir={alElegir} />;
  else if (error) contenido = <p className="text-verde">{t.error}</p>;
  else if (buscada !== termino || cargando)
    contenido = <p className="text-verde-gris">{t.buscando}</p>;
  else if (resultados.length === 0)
    contenido = <SinResultados termino={termino} alElegir={alElegir} />;
  else
    contenido = (
      <div className="flex flex-col gap-4">
        <p className="text-pequeno font-medium text-verde-gris">
          {t.resultados(resultados.length)}
        </p>
        <ListaResultados resultados={resultados} alElegir={alElegir} />
        {pie}
      </div>
    );

  return (
    <div aria-live="polite" aria-busy={cargando}>
      {contenido}
    </div>
  );
}
