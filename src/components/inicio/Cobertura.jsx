import Pendiente from '@/components/Pendiente';
import EnlaceSecundario from '@/components/ui/EnlaceSecundario';
import { firma } from '@/config/firma';
import { rutas } from '@/config/rutas';
import { interfaz } from '@/content/es/interfaz';

/**
 * 10 · Cobertura (§5.1 y §5.7). Criterio del cliente: regional con alcance nacional. El mapa
 * SVG de los departamentos llega en la Fase 5, con la página de Contacto.
 */
export default function Cobertura() {
  const { cobertura } = firma;
  const t = interfaz.inicio;
  return (
    <section aria-labelledby="cobertura" className="espacio-seccion">
      <div className="contenedor-amplio grid gap-10 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-4">
          <h2 id="cobertura" className="font-titulo text-titulo text-verde">
            {t.coberturaTitulo}
          </h2>
          <p className="text-verde-gris">
            {t.sedePrincipal}: {cobertura.materialInstitucional.sede}
          </p>
        </div>
        <div className="flex flex-col gap-6">
          <ul className="flex flex-col gap-1 font-titulo text-titulo text-verde">
            {cobertura.departamentos.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <ul className="flex flex-col gap-1 text-verde-gris">
            {cobertura.alcanceNacional.map((linea) => (
              <li key={linea}>{linea}</li>
            ))}
          </ul>
          <Pendiente valor={cobertura.texto}>
            {(texto) => <p className="max-w-prose text-verde-gris">{texto}</p>}
          </Pendiente>
          <EnlaceSecundario href={rutas.contacto}>{t.escribanos}</EnlaceSecundario>
        </div>
      </div>
    </section>
  );
}
