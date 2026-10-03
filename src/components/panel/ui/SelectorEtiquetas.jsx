'use client';

import { publicaciones as tp } from '@/content/es/panel';

/**
 * Etiquetas de una publicación o lectura (§5.5): casillas agrupadas en un fieldset.
 * @param {{ etiquetas: { id: string, name: string }[], seleccion: string[], alCambiar: (ids: string[]) => void }} props
 */
export default function SelectorEtiquetas({ etiquetas, seleccion, alCambiar }) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="mb-2 font-medium text-verde">{tp.etiquetas}</legend>
      {etiquetas.length === 0 ? (
        <p className="text-pequeno text-verde-gris">{tp.sinEtiquetas}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {etiquetas.map((e) => {
            const marcada = seleccion.includes(e.id);
            return (
              <label
                key={e.id}
                className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-pildora border px-4 has-focus-visible:outline-2 has-focus-visible:outline-oro ${
                  marcada ? 'border-verde bg-verde text-marfil' : 'border-verde/25 text-verde'
                }`}
              >
                <input
                  type="checkbox"
                  checked={marcada}
                  onChange={() =>
                    alCambiar(
                      marcada ? seleccion.filter((id) => id !== e.id) : [...seleccion, e.id],
                    )
                  }
                  className="sr-only"
                />
                {e.name}
              </label>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}
