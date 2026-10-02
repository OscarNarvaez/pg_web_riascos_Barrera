import { inicio } from '@/content/es/inicio';

/** 8 · Nuestra promesa (§5.1): la frase central con la tipografía secundaria, sobre verde. */
export default function Promesa() {
  const t = inicio.promesa;
  return (
    <section aria-labelledby="promesa" className="bg-verde espacio-seccion text-marfil">
      <div className="contenedor-amplio flex flex-col gap-16 sm:gap-20">
        <h2 id="promesa" className="max-w-[16ch] font-editorial text-display">
          {t.titulo}
        </h2>
        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {t.compromisos.map((c) => (
            <li key={c} className="border-t border-oro pt-5">
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
