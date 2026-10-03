import Guardia from '@/components/panel/sesion/Guardia';

/** Secciones que exigen sesión. */
export default function LayoutGestion({ children }) {
  return <Guardia>{children}</Guardia>;
}
