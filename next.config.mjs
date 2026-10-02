/**
 * Exportación estática para GitHub Pages (especificación §3.2 y §3.3).
 * La ruta base viene de NEXT_PUBLIC_BASE_PATH: vacía con dominio propio,
 * "/pg_web_riascos_Barrera" mientras el sitio viva en github.io (§4.2).
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
