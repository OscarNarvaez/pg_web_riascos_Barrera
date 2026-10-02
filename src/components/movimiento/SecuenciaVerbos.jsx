'use client';

import { useRef, useState, useSyncExternalStore } from 'react';
import { useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import * as m from 'motion/react-m';

/**
 * Fotogramas clave de una palabra dentro del recorrido total (0 a 1).
 * Cada par ocupa 1/n del recorrido: el verbo reactivo descansa, sale; el estratégico entra,
 * descansa y sale. El primero ya está visible al llegar y el último se queda.
 */
function fotogramas(indice, total, tipo) {
  const w = 1 / total;
  const s = indice * w;
  if (tipo === 'reactivo') {
    return indice === 0
      ? { t: [0, s + 0.35 * w, s + 0.5 * w], o: [1, 1, 0], y: [0, 0, -24] }
      : { t: [s, s + 0.15 * w, s + 0.35 * w, s + 0.5 * w], o: [0, 1, 1, 0], y: [24, 0, 0, -24] };
  }
  return indice === total - 1
    ? { t: [s + 0.5 * w, s + 0.65 * w, 1], o: [0, 1, 1], y: [24, 0, 0] }
    : { t: [s + 0.5 * w, s + 0.65 * w, s + 0.85 * w, s + w], o: [0, 1, 1, 0], y: [24, 0, 0, -24] };
}

/** Una palabra ligada al desplazamiento: opacidad, desenfoque y desplazamiento vertical. */
function Palabra({ progreso, indice, total, tipo, texto }) {
  const f = fotogramas(indice, total, tipo);
  const opacity = useTransform(progreso, f.t, f.o);
  const y = useTransform(progreso, f.t, f.y);
  const filter = useTransform(opacity, (o) => `blur(${((1 - o) * 8).toFixed(2)}px)`);
  return (
    <m.span
      className={`absolute inset-0 flex items-center justify-center ${
        tipo === 'reactivo' ? 'text-verde-gris' : 'text-verde'
      }`}
      style={{ opacity, y, filter }}
    >
      {texto}
    </m.span>
  );
}

/** Equipos con pocos núcleos o poca memoria: transición por pasos en lugar de continua (§9.6). */
function esEquipoLento() {
  return (navigator.hardwareConcurrency ?? 8) <= 4 || (navigator.deviceMemory ?? 8) <= 4;
}

// Las capacidades del equipo no cambian durante la visita: no hay nada a qué suscribirse.
const sinSuscripcion = () => () => {};

/**
 * Momento 3 (§9.6), la firma visual del sitio: sección fija mientras se desplaza; cada verbo
 * del modelo reactivo se transforma en su par estratégico.
 *
 * Con movimiento reducido, la secuencia se convierte en una tabla estática apilada. Esa tabla
 * existe siempre para los lectores de pantalla; el escenario animado es decorativo.
 *
 * @param {object} props
 * @param {string} props.titulo
 * @param {{ reactivo: string, estrategico: string }[]} props.pares
 * @param {{ reactivo: string, estrategico: string }} props.encabezados Títulos de las columnas.
 * @param {boolean} [props.tituloVisible] Muestra el título en el escenario y en la tabla
 *   estática. En falso, la sección ya tiene su propio encabezado visible y el título queda solo
 *   para lectores de pantalla.
 */
export default function SecuenciaVerbos({ titulo, pares, encabezados, tituloVisible = true }) {
  const contenedor = useRef(null);
  const { scrollYProgress } = useScroll({ target: contenedor, offset: ['start start', 'end end'] });
  const [actual, setActual] = useState(0);
  const [fase, setFase] = useState('reactivo');
  // En el servidor se asume un equipo normal; en el navegador se lee sin efecto ni render extra.
  const lento = useSyncExternalStore(sinSuscripcion, esEquipoLento, () => false);
  const total = pares.length;

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const posicion = Math.min(p, 0.9999) * total;
    setActual(Math.floor(posicion));
    setFase(posicion % 1 < 0.5 ? 'reactivo' : 'estrategico');
  });

  return (
    <div>
      {/* Una <table> no se encoge a 1 px como un bloque: con sr-only directo desbordaba la
          página en pantallas estrechas. El contenedor es el que se oculta. */}
      <div className="sr-only motion-reduce:not-sr-only">
        <table className="w-full text-left">
          <caption className={tituloVisible ? 'pb-6 text-left font-titulo text-titulo' : 'sr-only'}>
            {titulo}
          </caption>
          <thead>
            <tr className="border-b border-oro">
              <th className="py-3 font-medium text-verde-gris">{encabezados.reactivo}</th>
              <th className="py-3 font-medium text-verde-gris">{encabezados.estrategico}</th>
            </tr>
          </thead>
          <tbody>
            {pares.map((par) => (
              <tr key={par.reactivo} className="font-titulo text-subtitulo">
                <td className="py-3 text-verde-gris">{par.reactivo}</td>
                <td className="py-3 text-verde">{par.estrategico}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div ref={contenedor} aria-hidden="true" className="relative h-[400svh] motion-reduce:hidden">
        <div className="sticky top-0 flex h-svh flex-col justify-between py-[max(6rem,12svh)]">
          <div className="flex items-baseline justify-between gap-6">
            {tituloVisible ? (
              <p className="font-titulo text-titulo text-verde">{titulo}</p>
            ) : (
              <span />
            )}
            <p className="text-pequeno text-verde-gris tabular-nums">
              {actual + 1} / {total}
            </p>
          </div>

          <div className="relative h-[1.2em] font-titulo text-display">
            {lento
              ? pares.map((par, i) => (
                  <span
                    key={par.reactivo}
                    className="absolute inset-0 flex items-center justify-center transition-opacity duration-(--duracion-interfaz) ease-estandar"
                    style={{ opacity: i === actual ? 1 : 0 }}
                  >
                    <span className={fase === 'reactivo' ? 'text-verde-gris' : 'text-verde'}>
                      {fase === 'reactivo' ? par.reactivo : par.estrategico}
                    </span>
                  </span>
                ))
              : pares.flatMap((par, i) => [
                  <Palabra
                    key={`r-${par.reactivo}`}
                    progreso={scrollYProgress}
                    indice={i}
                    total={total}
                    tipo="reactivo"
                    texto={par.reactivo}
                  />,
                  <Palabra
                    key={`e-${par.estrategico}`}
                    progreso={scrollYProgress}
                    indice={i}
                    total={total}
                    tipo="estrategico"
                    texto={par.estrategico}
                  />,
                ])}
          </div>

          <ol className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-4">
            {pares.map((par, i) => (
              <li key={par.reactivo} className="flex flex-col gap-1 text-pequeno">
                <span className="text-verde-gris">{par.reactivo}</span>
                <span className="text-verde">{par.estrategico}</span>
                <span
                  className="h-px w-full origin-left bg-oro transition-transform duration-(--duracion-interfaz) ease-estandar"
                  style={{ transform: `scaleX(${i === actual ? 1 : 0})` }}
                />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
