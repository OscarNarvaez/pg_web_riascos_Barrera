import Imagen from '@/components/Imagen';
import EntradaImagen from '@/components/movimiento/EntradaImagen';
import Revelar from '@/components/movimiento/Revelar';
import TitularPorPalabras from '@/components/movimiento/TitularPorPalabras';
import Boton from '@/components/ui/Boton';
import EnlaceSecundario from '@/components/ui/EnlaceSecundario';
import { rutas } from '@/config/rutas';
import { inicio } from '@/content/es/inicio';
import { interfaz } from '@/content/es/interfaz';

/**
 * 1 · Hero (§5.1). Tipográfico sobre marfil; la fotografía va debajo, en su contenedor, sin
 * superposición ni degradado, y asoma bajo el pliegue (plan de diseño §4). Momento 1 de §9.6.
 */
export default function Hero() {
  const { hero } = inicio;
  return (
    <section className="contenedor-amplio flex flex-col gap-12 pt-[calc(8rem+env(safe-area-inset-top))] pb-(--espacio-seccion) sm:gap-16 lg:pt-[calc(10rem+env(safe-area-inset-top))]">
      <div className="flex flex-col gap-6 sm:gap-8">
        <TitularPorPalabras
          texto={hero.titular}
          className="max-w-[12ch] font-titulo text-display text-verde"
        />
        <Revelar retraso={0.5}>
          <p className="max-w-[30ch] font-titulo text-subtitulo text-verde-gris">
            {hero.subtitulo}
          </p>
        </Revelar>
        <Revelar
          retraso={0.7}
          className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8"
        >
          <Boton href={rutas.consulta}>{interfaz.acciones.agendeConsulta}</Boton>
          <EnlaceSecundario href={rutas.areas}>{interfaz.acciones.conozcaAreas}</EnlaceSecundario>
        </Revelar>
      </div>
      <EntradaImagen className="rounded-contenedor">
        {/* Decorativa: el mensaje del hero está en el titular. */}
        <Imagen nombre="inicio-hero" alt="" prioritaria sizes="(min-width: 1440px) 1320px, 100vw" />
      </EntradaImagen>
    </section>
  );
}
