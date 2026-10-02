import Filete from '@/components/ui/Filete';
import { inicio } from '@/content/es/inicio';

/**
 * 6 · Las cuatro perspectivas y la comparación (§5.1). La diferencia con la firma tradicional
 * se expresa con tamaño, no con una tabla de ✓ y ✗ (plan de diseño §7).
 */
export default function Perspectivas() {
  const t = inicio.perspectivas;
  const { tradicional, firma } = t.comparacion;
  return (
    <section aria-labelledby="perspectivas" className="espacio-seccion">
      <div className="contenedor-amplio flex flex-col gap-14">
        <header className="flex max-w-4xl flex-col gap-6">
          <h2 id="perspectivas" className="font-titulo text-titulo text-verde">
            {t.titulo}
          </h2>
          <p className="max-w-prose text-verde-gris">{t.introduccion}</p>
        </header>
        <ul className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {t.lista.map((p) => (
            <li key={p.nombre} className="flex flex-col gap-4">
              <Filete />
              <h3 className="font-titulo text-subtitulo text-verde">{p.nombre}</h3>
              <p className="text-verde-gris">{p.mira}</p>
            </li>
          ))}
        </ul>
        <div className="grid gap-10 pt-6 md:grid-cols-[1fr_2fr] md:items-start">
          <div className="flex flex-col gap-2">
            <p className="text-pequeno font-medium text-verde-gris">{tradicional.quien}</p>
            <p className="text-verde-gris">{tradicional.que}</p>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-pequeno font-medium text-verde">{firma.quien}</p>
            <p className="font-titulo text-titulo text-verde">{firma.que}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
