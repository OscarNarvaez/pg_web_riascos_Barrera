'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { IconoLupa } from '@/components/ui/Iconos';
import { textosBuscador as t } from '@/content/es/publicaciones';
import PanelBusqueda from './PanelBusqueda';

/**
 * Página de resultados /buscar/?q= (§5.6). Los resultados se obtienen en el navegador; la URL se
 * actualiza al escribir para que el enlace se pueda compartir.
 */
export default function PaginaBuscar() {
  const parametros = useSearchParams();
  const [consulta, setConsulta] = useState(() => parametros.get('q') ?? '');

  function cambiar(valor) {
    setConsulta(valor);
    const url = new URL(window.location.href);
    if (valor.trim()) url.searchParams.set('q', valor.trim());
    else url.searchParams.delete('q');
    window.history.replaceState(null, '', url);
  }

  return (
    <div className="flex flex-col gap-10">
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label className="flex items-center gap-4 border-b border-verde/20 pb-3 focus-within:border-oro">
          <span className="sr-only">{t.campo}</span>
          <IconoLupa className="shrink-0 text-verde-gris" />
          <input
            type="search"
            name="q"
            value={consulta}
            onChange={(e) => cambiar(e.target.value)}
            autoComplete="off"
            enterKeyHint="search"
            placeholder={t.ejemplo}
            className="w-full bg-transparent font-titulo text-subtitulo text-verde outline-none placeholder:text-verde-gris"
          />
        </label>
      </form>
      <PanelBusqueda consulta={consulta} limite={50} />
    </div>
  );
}
