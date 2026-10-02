import Imagen from '@/components/Imagen';
import Pendiente from '@/components/Pendiente';
import { interfaz } from '@/content/es/interfaz';
import Biografia from './Biografia';

/**
 * Ficha de un integrante (§5.4): retrato, nombre, cargo, enfoque, "Aporta criterio…" y
 * biografía si existe. Cargo y correo sin confirmar no se muestran en producción (§14.4).
 * Nunca se publican teléfonos personales (regla 8).
 */
export default function FichaIntegrante({ persona }) {
  const t = interfaz.equipo;
  return (
    <article
      aria-labelledby={`ficha-${persona.retrato}`}
      className="grid items-start gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16"
    >
      <Imagen
        nombre={persona.retrato}
        alt={persona.nombre}
        className="w-full max-w-md rounded-contenedor"
        sizes="(min-width: 768px) 40vw, 100vw"
      />
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 id={`ficha-${persona.retrato}`} className="font-titulo text-titulo text-verde">
            {persona.nombre}
          </h2>
          <Pendiente valor={persona.cargo}>
            {(cargo) => <p className="font-titulo text-subtitulo text-verde-gris">{cargo}</p>}
          </Pendiente>
        </div>
        <dl className="flex flex-col gap-2">
          <dt className="text-pequeno font-medium text-verde-gris">{t.enfoque}</dt>
          <dd className="max-w-prose">{persona.enfoque}</dd>
        </dl>
        <p className="max-w-prose font-titulo text-subtitulo text-verde">
          {t.aporta} {persona.aporta}
        </p>
        <Pendiente valor={persona.correo}>
          {(correo) => (
            <a href={`mailto:${correo}`} className="subrayado-animado self-start text-verde">
              {correo}
            </a>
          )}
        </Pendiente>
        {persona.biografia?.length > 0 && (
          <Biografia nombre={persona.nombre} parrafos={persona.biografia} />
        )}
      </div>
    </article>
  );
}
