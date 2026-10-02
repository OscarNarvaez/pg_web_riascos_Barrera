'use client';

import { useState } from 'react';
import { textosPublicaciones as t } from '@/content/es/publicaciones';

const boton =
  'presionable inline-flex min-h-11 items-center rounded-pildora border border-verde/20 px-4 text-pequeno font-medium text-verde hover:border-verde';

/**
 * Compartir en LinkedIn, WhatsApp o copiar el enlace (§5.5). Enlaces simples: sin scripts de
 * terceros ni rastreo.
 * @param {{ url: string, titulo: string }} props
 */
export default function Compartir({ url, titulo }) {
  const [copiado, setCopiado] = useState(false);
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${titulo} ${url}`)}`;

  async function copiar() {
    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      // Sin permiso de portapapeles: el enlace sigue visible en la barra de direcciones.
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-pequeno font-medium text-verde-gris">{t.compartir}</p>
      <ul className="flex flex-wrap gap-2">
        <li>
          <a
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.compartirEn('LinkedIn')}
            className={boton}
          >
            LinkedIn
          </a>
        </li>
        <li>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.compartirEn('WhatsApp')}
            className={boton}
          >
            WhatsApp
          </a>
        </li>
        <li>
          <button type="button" onClick={copiar} className={boton}>
            {copiado ? t.enlaceCopiado : t.copiarEnlace}
          </button>
        </li>
      </ul>
      <p aria-live="polite" className="sr-only">
        {copiado ? t.enlaceCopiado : ''}
      </p>
    </div>
  );
}
