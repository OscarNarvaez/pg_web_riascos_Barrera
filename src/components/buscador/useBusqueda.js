'use client';

import { useEffect, useState } from 'react';
import { buscar } from '@/lib/busqueda';

/**
 * Búsqueda en vivo con retardo (§5.6: 250 ms). Descarta respuestas de consultas anteriores.
 * @param {string} q
 * @param {{ retardo?: number, limite?: number }} [opciones]
 */
export function useBusqueda(q, { retardo = 250, limite = 20 } = {}) {
  const [estado, setEstado] = useState({
    consulta: '',
    resultados: [],
    cargando: false,
    error: false,
  });

  useEffect(() => {
    const termino = q.trim();
    if (!termino) return undefined;
    let vigente = true;
    const temporizador = setTimeout(async () => {
      setEstado((e) => ({ ...e, cargando: true, error: false }));
      try {
        const resultados = await buscar(termino, limite);
        if (vigente) setEstado({ consulta: termino, resultados, cargando: false, error: false });
      } catch {
        if (vigente) setEstado({ consulta: termino, resultados: [], cargando: false, error: true });
      }
    }, retardo);
    return () => {
      vigente = false;
      clearTimeout(temporizador);
    };
  }, [q, retardo, limite]);

  // Sin consulta, no hay resultados que mostrar (se deriva, no se guarda en el estado).
  return q.trim() ? estado : { consulta: '', resultados: [], cargando: false, error: false };
}
