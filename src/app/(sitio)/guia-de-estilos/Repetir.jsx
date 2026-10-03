'use client';

import { useState } from 'react';

/** Vuelve a montar su contenido para repetir una animación de entrada. Solo para la guía. */
export default function Repetir({ children }) {
  const [vuelta, setVuelta] = useState(0);
  return (
    <div className="flex flex-col gap-6">
      <div key={vuelta}>{children}</div>
      <button
        type="button"
        onClick={() => setVuelta((v) => v + 1)}
        className="presionable self-start rounded-pildora border border-verde/20 px-4 py-2 text-pequeno font-medium text-verde"
      >
        Repetir la animación
      </button>
    </div>
  );
}
