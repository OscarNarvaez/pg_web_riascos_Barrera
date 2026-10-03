'use client';

import { useState } from 'react';
import Boton from '@/components/ui/Boton';
import { panel } from '@/content/es/panel';

/**
 * Copia un texto al portapapeles y lo confirma de forma accesible.
 * @param {{ texto: string, etiqueta?: string }} props `etiqueta` es el nombre accesible del botón.
 */
export default function BotonCopiar({ texto, etiqueta }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Sin permiso de portapapeles el enlace sigue visible para copiarlo a mano.
    }
  }

  return (
    <span className="inline-flex items-center gap-3">
      <Boton variante="contorno" tamano="compacto" onClick={copiar} aria-label={etiqueta}>
        {panel.copiar}
      </Boton>
      <span role="status" className="text-pequeno text-verde-gris">
        {copiado ? panel.copiado : ''}
      </span>
    </span>
  );
}
