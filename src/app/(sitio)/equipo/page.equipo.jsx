import EncabezadoPagina from '@/components/EncabezadoPagina';
import FichaIntegrante from '@/components/equipo/FichaIntegrante';
import Imagen from '@/components/Imagen';
import { firma } from '@/config/firma';
import { equipo } from '@/content/es/equipo';
import { interfaz } from '@/content/es/interfaz';
import { primeraOracion } from '@/lib/texto';

export const metadata = {
  title: interfaz.paginas.equipo,
  description: primeraOracion(equipo.introduccion[0]),
};

/**
 * Equipo (§5.4 y Anexo A.5). La extensión .equipo.jsx hace que la página solo exista con
 * NEXT_PUBLIC_EQUIPO_ACTIVO distinto de "false" (ver next.config.mjs): si se desactiva, no se
 * genera, y el menú, el Inicio y el sitemap dejan de enlazarla.
 */
export default function Equipo() {
  const integrantes = firma.integrantesPublicados
    .map((id) => equipo.integrantes[id])
    .filter(Boolean);
  const [entradilla, ...introduccion] = equipo.introduccion;

  return (
    <>
      <EncabezadoPagina titulo={interfaz.paginas.equipo} entradilla={entradilla}>
        <Imagen
          nombre="equipo-grupal"
          alt=""
          prioritaria
          className="rounded-contenedor"
          sizes="(min-width: 1440px) 1320px, 100vw"
        />
      </EncabezadoPagina>

      <div className="contenedor-lectura pb-(--espacio-seccion)">
        {introduccion.map((p) => (
          <p key={p.slice(0, 32)} className="max-w-prose text-verde-gris">
            {p}
          </p>
        ))}
      </div>

      <div className="contenedor-amplio flex flex-col gap-(--espacio-seccion) pb-(--espacio-seccion)">
        {integrantes.map((persona) => (
          <FichaIntegrante key={persona.nombre} persona={persona} />
        ))}
      </div>
    </>
  );
}
