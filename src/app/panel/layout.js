import ProveedorSesion from '@/components/panel/sesion/ProveedorSesion';
import { firma } from '@/config/firma';
import { panel } from '@/content/es/panel';

/** Panel de administración (§7): noindex siempre, fuera del sitemap y bloqueado en robots.txt. */
export const metadata = {
  title: { default: panel.nombre, template: `%s · ${panel.nombre} | ${firma.nombre}` },
  robots: { index: false, follow: false },
};

export default function LayoutPanel({ children }) {
  return <ProveedorSesion>{children}</ProveedorSesion>;
}
