import EncabezadoPagina from '@/components/EncabezadoPagina';
import Imagen from '@/components/Imagen';
import SubnavegacionAreas from '@/components/SubnavegacionAreas';
import Boton from '@/components/ui/Boton';
import { rutas } from '@/config/rutas';
import { areas, paginaAreas } from '@/content/es/areas';
import { interfaz } from '@/content/es/interfaz';

export const metadata = {
  title: interfaz.paginas.areas,
  description: paginaAreas.introduccion,
};

/**
 * Áreas de Práctica (§5.3 y Anexo A.4): una sola página con anclas por área. Las páginas
 * individuales por área son de la Fase 2 del contrato y no se construyen.
 */
export default function AreasDePractica() {
  const { servicios, perspectivas } = paginaAreas;

  return (
    <>
      <EncabezadoPagina titulo={interfaz.paginas.areas} entradilla={paginaAreas.introduccion} />

      <SubnavegacionAreas areas={areas.map(({ ancla, nombre }) => ({ ancla, nombre }))} />

      {areas.map((area, i) => (
        <section
          key={area.ancla}
          id={area.ancla}
          aria-labelledby={`${area.ancla}-titulo`}
          className="scroll-mt-40 espacio-seccion"
        >
          <div className="contenedor-amplio grid items-center gap-10 md:grid-cols-2 md:gap-16">
            <div className={`flex flex-col gap-6 ${i % 2 ? 'md:order-2' : ''}`}>
              <h2 id={`${area.ancla}-titulo`} className="font-titulo text-titulo text-verde">
                {area.nombre}
              </h2>
              <p className="max-w-[36ch] font-titulo text-subtitulo text-verde-gris">
                {area.resumen}
              </p>
            </div>
            <Imagen
              nombre={area.imagen}
              alt=""
              className="rounded-contenedor"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </section>
      ))}

      <section aria-labelledby="servicios" className="bg-verde espacio-seccion text-marfil">
        <div className="contenedor-amplio grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            <h2 id="servicios" className="font-titulo text-titulo">
              {servicios.titulo}
            </h2>
            <p className="max-w-prose text-marfil/75">{servicios.introduccion}</p>
          </div>
          <ul>
            {servicios.lista.map((s) => (
              <li key={s} className="border-t border-oro py-5 last:border-b">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="perspectivas" className="espacio-seccion">
        <div className="contenedor-lectura flex flex-col gap-8">
          <h2 id="perspectivas" className="font-titulo text-titulo text-verde">
            {perspectivas.titulo}
          </h2>
          <p className="max-w-prose">{perspectivas.texto}</p>
          <Boton href={rutas.consulta} className="self-start">
            {interfaz.acciones.agendeConsulta}
          </Boton>
        </div>
      </section>
    </>
  );
}
