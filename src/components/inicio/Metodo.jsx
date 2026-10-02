import LineaProgreso from '@/components/movimiento/LineaProgreso';
import { inicio } from '@/content/es/inicio';

/** 7 · Nuestro método (§5.1): línea de progreso ligada al desplazamiento (momento 4 de §9.6). */
export default function Metodo() {
  const t = inicio.metodo;
  return (
    <section aria-labelledby="metodo" className="espacio-seccion">
      <div className="contenedor-amplio grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <div>
          <h2 id="metodo" className="font-titulo text-titulo text-verde lg:sticky lg:top-28">
            {t.titulo}
          </h2>
        </div>
        <LineaProgreso pasos={t.pasos} />
      </div>
    </section>
  );
}
