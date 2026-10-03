'use client';

import { useCallback, useEffect, useState } from 'react';
import { codigoDeError } from '@/lib/panel/errores';

/**
 * Ejecuta una consulta de Supabase al montar y cada vez que cambian sus dependencias.
 * Devuelve los datos, el código de error (src/lib/panel/errores.js) y una función para recargar.
 *
 * @template T
 * @param {() => PromiseLike<{ data: T | null, error: any, count?: number | null }>} consulta
 * @param {unknown[]} dependencias
 */
export function useConsulta(consulta, dependencias) {
  const [estado, setEstado] = useState(
    /** @type {{ cargando: boolean, datos: T | null, error: string | null, total: number | null }} */ ({
      cargando: true,
      datos: null,
      error: null,
      total: null,
    }),
  );
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let vigente = true;
    Promise.resolve(consulta())
      .then((r) => {
        if (vigente) {
          setEstado({
            cargando: false,
            datos: r.data,
            error: codigoDeError(r.error),
            total: r.count ?? null,
          });
        }
      })
      .catch((e) => {
        if (vigente)
          setEstado({ cargando: false, datos: null, error: codigoDeError(e), total: null });
      });
    return () => {
      vigente = false;
    };
    // La consulta se define en cada render; sus entradas son las dependencias declaradas.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, version]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);
  return { ...estado, recargar };
}
