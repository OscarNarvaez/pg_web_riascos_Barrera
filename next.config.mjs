import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/**
 * Exportación estática para GitHub Pages (especificación §3.2 y §3.3).
 * La ruta base viene de NEXT_PUBLIC_BASE_PATH: vacía con dominio propio,
 * "/pg_web_riascos_Barrera" mientras el sitio viva en github.io (§4.2).
 *
 * Las páginas con extensión .dev.js (la guía de estilos, §9.8) solo existen con `next dev`:
 * nunca llegan a la compilación de producción.
 *
 * @param {string} fase
 * @returns {import('next').NextConfig}
 */
export default function configuracion(fase) {
  const desarrollo = fase === PHASE_DEVELOPMENT_SERVER;
  return {
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
    pageExtensions: desarrollo ? ['dev.js', 'dev.jsx', 'js', 'jsx'] : ['js', 'jsx'],
    reactStrictMode: true,
    poweredByHeader: false,
    // Impide que `next dev` reescriba CLAUDE.md; su recomendación ya está incluida allí.
    agentRules: false,
  };
}
