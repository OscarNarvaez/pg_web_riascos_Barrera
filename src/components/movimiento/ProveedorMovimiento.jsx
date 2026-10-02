'use client';

import { LazyMotion, MotionConfig } from 'motion/react';

const cargarCaracteristicas = () => import('./caracteristicas').then((m) => m.default);

/**
 * Carga diferida de Motion (§3.3 y §11): el código de animación llega después del primer
 * pintado. `strict` impide usar el componente `motion` completo por error.
 * Con movimiento reducido, Motion omite transformaciones; el CSS de globals.css garantiza
 * además que todo sea visible desde el primer render (§9.6).
 */
export default function ProveedorMovimiento({ children }) {
  return (
    <LazyMotion features={cargarCaracteristicas} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
