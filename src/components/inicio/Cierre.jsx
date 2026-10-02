import Imagen from '@/components/Imagen';
import Boton from '@/components/ui/Boton';
import { rutas } from '@/config/rutas';
import { inicio } from '@/content/es/inicio';
import { interfaz } from '@/content/es/interfaz';

/** 12 · Cierre (§5.1): panorámica, la frase de cierre con la tipografía secundaria y el llamado. */
export default function Cierre() {
  const t = inicio.cierre;
  return (
    <section aria-labelledby="cierre" className="espacio-seccion">
      <div className="contenedor-amplio flex flex-col gap-14">
        <Imagen
          nombre="inicio-cierre"
          alt=""
          className="rounded-contenedor"
          sizes="(min-width: 1440px) 1320px, 100vw"
        />
        <div className="flex max-w-4xl flex-col gap-6">
          <h2 id="cierre" className="font-editorial text-titulo text-verde">
            {t.titulo}
          </h2>
          <p className="max-w-prose text-verde-gris">{t.texto}</p>
          <Boton href={rutas.consulta} className="self-start">
            {interfaz.acciones.agendeConsulta}
          </Boton>
        </div>
      </div>
    </section>
  );
}
