import Imagen from '@/components/Imagen';
import Pendiente from '@/components/Pendiente';
import EnlaceSecundario from '@/components/ui/EnlaceSecundario';
import { firma } from '@/config/firma';
import { rutas } from '@/config/rutas';
import { equipo } from '@/content/es/equipo';
import { interfaz } from '@/content/es/interfaz';

/**
 * 9 · Vista previa del equipo (§5.1). Solo si Equipo está activo; por decisión del cliente,
 * con la ficha de Marcela Riascos Eraso.
 */
export default function EquipoVista() {
  if (!firma.equipoActivo) return null;
  const persona = equipo.integrantes[firma.integrantesPublicados[0]];
  if (!persona) return null;
  const t = interfaz.equipo;

  return (
    <section aria-labelledby="equipo-vista" className="espacio-seccion">
      <div className="contenedor-amplio grid items-center gap-10 md:grid-cols-[1fr_1.3fr] md:gap-16">
        <Imagen
          nombre={persona.retrato}
          alt={persona.nombre}
          className="w-full max-w-md rounded-contenedor"
          sizes="(min-width: 768px) 40vw, 100vw"
        />
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h2 id="equipo-vista" className="font-titulo text-titulo text-verde">
              {persona.nombre}
            </h2>
            <Pendiente valor={persona.cargo}>
              {(cargo) => <p className="font-titulo text-subtitulo text-verde-gris">{cargo}</p>}
            </Pendiente>
          </div>
          <p className="max-w-prose text-verde-gris">{persona.enfoque}</p>
          <p className="max-w-prose font-titulo text-subtitulo text-verde">
            {t.aporta} {persona.aporta}
          </p>
          <EnlaceSecundario href={rutas.equipo}>{interfaz.inicio.conozcaEquipo}</EnlaceSecundario>
        </div>
      </div>
    </section>
  );
}
