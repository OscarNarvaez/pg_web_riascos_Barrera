import EncabezadoPagina from '@/components/EncabezadoPagina';
import Imagen from '@/components/Imagen';
import Boton from '@/components/ui/Boton';
import Filete from '@/components/ui/Filete';
import { firma } from '@/config/firma';
import { rutas } from '@/config/rutas';
import { interfaz } from '@/content/es/interfaz';
import { laFirma } from '@/content/es/la-firma';
import { primeraOracion } from '@/lib/texto';

export const metadata = {
  title: interfaz.paginas.laFirma,
  description: primeraOracion(laFirma.presentacion[0]),
};

/** Bloque de dos columnas: título a la izquierda, texto a la derecha. */
function Bloque({ id, titulo, children }) {
  return (
    <section aria-labelledby={id} className="espacio-seccion">
      <div className="contenedor-amplio grid gap-8 md:grid-cols-[1fr_2fr] md:gap-16">
        <h2 id={id} className="font-titulo text-titulo text-verde">
          {titulo}
        </h2>
        <div className="flex max-w-prose flex-col gap-6">{children}</div>
      </div>
    </section>
  );
}

/** La Firma (§5.2 y Anexo A.3). */
export default function LaFirma() {
  const [entradilla, ...presentacion] = laFirma.presentacion;
  const { proposito, vision, posicionamiento, atributos, porQueElegirnos } = laFirma;

  return (
    <>
      <EncabezadoPagina titulo={interfaz.paginas.laFirma} entradilla={entradilla}>
        <Imagen
          nombre="firma-portada"
          alt=""
          prioritaria
          className="rounded-contenedor"
          sizes="(min-width: 1440px) 1320px, 100vw"
        />
      </EncabezadoPagina>

      <section aria-label={interfaz.paginas.laFirma} className="pb-(--espacio-seccion)">
        <div className="contenedor-lectura flex flex-col gap-6">
          {presentacion.map((p) => (
            <p key={p.slice(0, 32)} className="max-w-prose">
              {p}
            </p>
          ))}
        </div>
      </section>

      <Bloque id="proposito" titulo={proposito.titulo}>
        <p className="font-titulo text-subtitulo text-verde">{proposito.parrafos[0]}</p>
        <p className="text-verde-gris">{proposito.parrafos[1]}</p>
      </Bloque>

      <section aria-labelledby="vision" className="bg-verde espacio-seccion text-marfil">
        <div className="contenedor-amplio flex flex-col gap-8">
          <h2 id="vision" className="font-titulo text-titulo">
            {vision.titulo}
          </h2>
          <p className="max-w-[48ch] font-editorial text-subtitulo">{vision.texto}</p>
        </div>
      </section>

      <Bloque id="posicionamiento" titulo={posicionamiento.titulo}>
        {posicionamiento.parrafos.map((p) => (
          <p key={p.slice(0, 32)}>{p}</p>
        ))}
      </Bloque>

      <section aria-labelledby="atributos" className="espacio-seccion">
        <div className="contenedor-amplio flex flex-col gap-12">
          <h2 id="atributos" className="font-titulo text-titulo text-verde">
            {atributos.titulo}
          </h2>
          <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {atributos.lista.map((a) => (
              <li key={a.nombre} className="flex flex-col gap-4">
                <Filete />
                <h3 className="font-titulo text-subtitulo text-verde">{a.nombre}</h3>
                <p className="text-verde-gris first-letter:uppercase">{a.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="por-que" className="espacio-seccion">
        <div className="contenedor-amplio grid gap-10 md:grid-cols-[1fr_2fr] md:gap-16">
          <h2 id="por-que" className="font-titulo text-titulo text-verde">
            {porQueElegirnos.titulo}
          </h2>
          <ul>
            {porQueElegirnos.lista.map((r) => (
              <li
                key={r.nombre}
                className="flex flex-col gap-2 border-t border-oro py-6 last:border-b sm:flex-row sm:gap-10"
              >
                <h3 className="font-titulo text-subtitulo text-verde sm:w-2/5 sm:shrink-0">
                  {r.nombre}
                </h3>
                <p className="text-verde-gris">{r.texto}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Galería (§5.2): imágenes decorativas de la oficina. */}
      <div className="pb-(--espacio-seccion)">
        <div className="contenedor-amplio grid gap-4 md:grid-cols-2">
          <Imagen
            nombre="firma-oficina-01"
            alt=""
            className="rounded-contenedor"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
          <Imagen
            nombre="firma-oficina-02"
            alt=""
            className="rounded-contenedor"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </div>

      <section aria-labelledby="promesa" className="bg-verde espacio-seccion text-marfil">
        <div className="contenedor-amplio flex flex-col gap-10">
          <h2 id="promesa" className="max-w-[18ch] font-editorial text-titulo">
            {firma.promesa}
          </h2>
          <div className="flex max-w-prose flex-col gap-6 text-marfil/75">
            {laFirma.promesaExtendida.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
          <Boton href={rutas.consulta} variante="invertido" className="self-start">
            {interfaz.acciones.agendeConsulta}
          </Boton>
        </div>
      </section>
    </>
  );
}
