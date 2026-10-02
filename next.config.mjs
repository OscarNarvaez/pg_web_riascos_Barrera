import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

/**
 * Exportación estática para GitHub Pages (especificación §3.2 y §3.3).
 * La ruta base viene de NEXT_PUBLIC_BASE_PATH: vacía con dominio propio,
 * "/pg_web_riascos_Barrera" mientras el sitio viva en github.io (§4.2).
 *
 * Páginas condicionales por extensión de archivo:
 * - .dev.jsx (la guía de estilos, §9.8): solo existen con `next dev`, nunca en producción.
 * - .equipo.jsx (Equipo, §5.4): solo existen si NEXT_PUBLIC_EQUIPO_ACTIVO no es "false".
 *
 * @param {string} fase
 * @returns {import('next').NextConfig}
 */
export default function configuracion(fase) {
  const desarrollo = fase === PHASE_DEVELOPMENT_SERVER;
  // La página de Equipo (page.equipo.jsx) solo existe si la sección está activa (§5.4).
  const equipoActivo = process.env.NEXT_PUBLIC_EQUIPO_ACTIVO !== 'false';
  const extensiones = [
    ...(desarrollo ? ['dev.js', 'dev.jsx'] : []),
    ...(equipoActivo ? ['equipo.jsx'] : []),
    'js',
    'jsx',
  ];
  return {
    output: 'export',
    trailingSlash: true,
    images: { unoptimized: true },
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
    pageExtensions: extensiones,
    reactStrictMode: true,
    poweredByHeader: false,
    // Impide que `next dev` reescriba CLAUDE.md; su recomendación ya está incluida allí.
    agentRules: false,
  };
}
