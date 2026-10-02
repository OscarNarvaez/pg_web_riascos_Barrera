import SecuenciaVerbos from '@/components/movimiento/SecuenciaVerbos';
import { inicio } from '@/content/es/inicio';

/**
 * 4 · Pensamos antes de litigar (§5.1): el momento visual distintivo del sitio (momento 3 de §9.6).
 */
export default function PensamosAntes() {
  const t = inicio.pensamosAntes;
  return (
    <section aria-labelledby="pensamos-antes" className="pt-(--espacio-seccion)">
      <div className="contenedor-lectura flex flex-col gap-6">
        <h2 id="pensamos-antes" className="font-titulo text-titulo text-verde">
          {t.titulo}
        </h2>
        <p className="font-titulo text-subtitulo text-verde">{t.parrafos[0]}</p>
        <p className="max-w-prose text-verde-gris">{t.parrafos[1]}</p>
      </div>
      <div className="contenedor-amplio motion-reduce:pt-16 motion-reduce:pb-(--espacio-seccion)">
        <SecuenciaVerbos
          titulo={t.titulo}
          pares={t.pares}
          encabezados={t.encabezados}
          tituloVisible={false}
        />
      </div>
    </section>
  );
}
