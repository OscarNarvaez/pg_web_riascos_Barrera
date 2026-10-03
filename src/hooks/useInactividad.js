'use client';

import { useEffect, useRef } from 'react';
import { inactividadVencida, leerActividad, registrarActividad } from '@/lib/panel/inactividad';

const EVENTOS = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
const CADA_CUANTO_REGISTRAR_MS = 15_000;
const CADA_CUANTO_REVISAR_MS = 30_000;

/**
 * Llama a `alVencer` tras 60 minutos sin actividad en ninguna pestaña del panel (§7.1).
 * @param {boolean} activo
 * @param {() => void} alVencer
 */
export function useInactividad(activo, alVencer) {
  const vencer = useRef(alVencer);
  useEffect(() => {
    vencer.current = alVencer;
  }, [alVencer]);

  useEffect(() => {
    if (!activo) return undefined;
    let ultimaEscritura = 0;
    let vencida = false;

    const revisar = () => {
      if (!vencida && inactividadVencida(leerActividad())) {
        vencida = true;
        vencer.current();
      }
    };
    const alActuar = () => {
      const ahora = Date.now();
      if (ahora - ultimaEscritura < CADA_CUANTO_REGISTRAR_MS) return;
      ultimaEscritura = ahora;
      registrarActividad(ahora);
    };
    const alVolver = () => document.visibilityState === 'visible' && revisar();

    // Una sesión guardada de hace horas vence al abrir el panel, antes de registrar nada.
    revisar();
    if (!vencida && leerActividad() === null) registrarActividad();

    EVENTOS.forEach((e) => window.addEventListener(e, alActuar, { passive: true }));
    document.addEventListener('visibilitychange', alVolver);
    const intervalo = setInterval(revisar, CADA_CUANTO_REVISAR_MS);
    return () => {
      EVENTOS.forEach((e) => window.removeEventListener(e, alActuar));
      document.removeEventListener('visibilitychange', alVolver);
      clearInterval(intervalo);
    };
  }, [activo]);
}
