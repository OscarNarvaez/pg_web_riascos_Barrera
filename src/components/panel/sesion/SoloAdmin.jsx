'use client';

import { panel } from '@/content/es/panel';
import Aviso from '../ui/Aviso';
import { useSesion } from './ProveedorSesion';

/**
 * Secciones de administrador (§7.1). La interfaz no las muestra a un editor; aunque llegara a
 * ellas, RLS no le entregaría ningún dato.
 */
export default function SoloAdmin({ children }) {
  const { esAdmin } = useSesion();
  return esAdmin ? children : <Aviso>{panel.soloAdmin}</Aviso>;
}
