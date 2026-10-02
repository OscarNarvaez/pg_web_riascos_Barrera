'use client';

import { useEffect } from 'react';

const ENFOCABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Comportamiento accesible de una capa modal (§12): atrapa el foco dentro, cierra con Escape,
 * bloquea el desplazamiento del fondo y devuelve el foco al control que la abrió.
 *
 * @param {import('react').RefObject<HTMLElement>} ref Contenedor de la capa.
 * @param {boolean} abierto
 * @param {() => void} cerrar
 */
export function useDialogo(ref, abierto, cerrar) {
  useEffect(() => {
    if (!abierto || !ref.current) return undefined;
    const capa = ref.current;
    const previo = /** @type {HTMLElement | null} */ (document.activeElement);
    const html = document.documentElement;
    const desbordePrevio = html.style.overflow;
    html.style.overflow = 'hidden';

    const enfocables = () => [...capa.querySelectorAll(ENFOCABLES)];
    (capa.querySelector('[data-foco-inicial]') ?? enfocables()[0])?.focus();

    /** @param {KeyboardEvent} e */
    function alPresionar(e) {
      if (e.key === 'Escape') {
        e.preventDefault();
        cerrar();
        return;
      }
      if (e.key !== 'Tab') return;
      const lista = enfocables();
      if (lista.length === 0) return;
      const primero = lista[0];
      const ultimo = lista.at(-1);
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener('keydown', alPresionar);
    return () => {
      document.removeEventListener('keydown', alPresionar);
      html.style.overflow = desbordePrevio;
      previo?.focus();
    };
  }, [abierto, cerrar, ref]);
}
