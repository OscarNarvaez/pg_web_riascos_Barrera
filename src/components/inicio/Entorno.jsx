import { inicio } from '@/content/es/inicio';

/**
 * 3 · El nuevo entorno (§5.1), sobre verde profundo. Los cinco factores como lista tipográfica
 * separada por filetes, sin íconos (plan de diseño §7).
 */
export default function Entorno() {
  const t = inicio.entorno;
  return (
    <section aria-labelledby="entorno" className="bg-verde espacio-seccion text-marfil">
      <div className="contenedor-amplio flex flex-col gap-16 sm:gap-20">
        <header className="flex max-w-4xl flex-col gap-6">
          <h2 id="entorno" className="font-titulo text-titulo">
            {t.titulo}
          </h2>
          <p className="font-titulo text-subtitulo text-marfil/75">{t.contraste}</p>
          <p className="font-titulo text-subtitulo">{t.diferencia}</p>
        </header>
        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <p className="max-w-prose text-marfil/75">{t.introduccion}</p>
          <ul>
            {t.factores.map((factor) => (
              <li
                key={factor}
                className="border-t border-oro py-5 font-titulo text-subtitulo last:border-b"
              >
                {factor}
              </li>
            ))}
          </ul>
        </div>
        <p className="max-w-[26ch] font-editorial text-titulo">{t.conclusion}</p>
      </div>
    </section>
  );
}
