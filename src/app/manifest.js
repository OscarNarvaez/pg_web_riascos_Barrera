import { firma } from '@/config/firma';
import { conBase } from '@/lib/sitio';

export const dynamic = 'force-static';

/** @returns {import('next').MetadataRoute.Manifest} */
export default function manifest() {
  return {
    name: firma.nombre,
    short_name: firma.nombre,
    description: firma.subtitulo,
    lang: 'es-CO',
    start_url: conBase('/'),
    scope: conBase('/'),
    display: 'browser',
    background_color: '#f9f8f2',
    theme_color: '#f9f8f2',
    icons: [
      { src: conBase('/iconos/icono-192.png'), sizes: '192x192', type: 'image/png' },
      { src: conBase('/iconos/icono-512.png'), sizes: '512x512', type: 'image/png' },
    ],
  };
}
