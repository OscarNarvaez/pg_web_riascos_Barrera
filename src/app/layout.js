import './globals.css';
import { variablesDeFuentes } from '@/fonts';
import { firma } from '@/config/firma';
import { paleta } from '@/config/paleta';
import { interfaz } from '@/content/es/interfaz';
import { INDEXABLE, SITE_URL } from '@/lib/sitio';

/** @type {import('next').Metadata} */
export const metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: `${firma.nombre} | ${firma.concepto.replace(/\.$/, '')}`,
    template: `%s | ${firma.nombre}`,
  },
  description: firma.subtitulo,
  applicationName: firma.nombre,
  // noindex global mientras el sitio viva en github.io (§10).
  robots: INDEXABLE ? { index: true, follow: true } : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
};

/** @type {import('next').Viewport} */
export const viewport = {
  themeColor: paleta.marfil,
  colorScheme: 'light',
  // Necesario para que env(safe-area-inset-*) tenga valor en dispositivos con muesca (§9.5).
  viewportFit: 'cover',
};

// Sin JavaScript, las animaciones de entrada no se ejecutan: su estado inicial no debe ocultar nada.
const SIN_SCRIPT =
  '[data-revelar]{opacity:1!important;transform:none!important;filter:none!important}' +
  '[data-progreso]{transform:none!important}';

export default function RootLayout({ children }) {
  return (
    <html lang="es-CO" className={variablesDeFuentes}>
      <head>
        <noscript>
          <style>{SIN_SCRIPT}</style>
        </noscript>
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenido"
          className="sr-only rounded-pildora bg-verde px-5 py-3 text-marfil focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
        >
          {interfaz.saltarAlContenido}
        </a>
        {/* El armazón vive en (sitio)/layout.js y en panel/layout.js: el panel no carga el del
            sitio público, ni el sitio el del panel (§11). Ambos tienen su <main id="contenido">. */}
        {children}
      </body>
    </html>
  );
}
