/**
 * Guía de estilos (especificación §9.8.4). Solo existe con `pnpm dev`: la extensión .dev.jsx
 * no se reconoce en la compilación de producción (ver next.config.mjs).
 * Los rótulos de esta página son de uso interno; los textos de marca salen del Anexo A.
 */
import Imagen from '@/components/Imagen';
import Logo from '@/components/Logo';
import Pendiente from '@/components/Pendiente';
import EntradaImagen from '@/components/movimiento/EntradaImagen';
import LineaProgreso from '@/components/movimiento/LineaProgreso';
import ResaltadoProgresivo from '@/components/movimiento/ResaltadoProgresivo';
import Revelar from '@/components/movimiento/Revelar';
import SecuenciaVerbos from '@/components/movimiento/SecuenciaVerbos';
import TitularPorPalabras from '@/components/movimiento/TitularPorPalabras';
import Boton from '@/components/ui/Boton';
import Campo from '@/components/ui/Campo';
import Casilla from '@/components/ui/Casilla';
import EnlaceSecundario from '@/components/ui/EnlaceSecundario';
import Filete from '@/components/ui/Filete';
import Mosaico from '@/components/ui/Mosaico';
import { firma } from '@/config/firma';
import { opacidadVidrio, paleta } from '@/config/paleta';
import { rutas } from '@/config/rutas';
import { areas } from '@/content/es/areas';
import { inicio } from '@/content/es/inicio';
import { interfaz } from '@/content/es/interfaz';
import { breveNews, breveTitle } from '@/fonts/fuentes.generated';
import { contraste, mezclar } from '@/lib/contraste';
import Repetir from './Repetir';

export const metadata = { title: 'Guía de estilos', robots: { index: false, follow: false } };

const COLORES = [
  {
    nombre: 'verde',
    clase: 'bg-verde',
    hex: paleta.verde,
    rol: 'Texto principal, secciones de convicción, botón principal',
  },
  {
    nombre: 'verde-gris',
    clase: 'bg-verde-gris',
    hex: paleta.verdeGris,
    rol: 'Texto secundario sobre marfil',
  },
  {
    nombre: 'oro',
    clase: 'bg-oro',
    hex: paleta.oro,
    rol: 'Acento: filete, numerales, foco; texto solo ≥ 24 px',
  },
  { nombre: 'oliva', clase: 'bg-oliva', hex: paleta.oliva, rol: 'Solo en tinte: mosaicos al 15 %' },
  {
    nombre: 'marfil',
    clase: 'bg-marfil',
    hex: paleta.marfil,
    rol: 'Fondo principal, texto sobre verde',
  },
];

const PARES = [
  ['Verde sobre marfil', paleta.verde, paleta.marfil, 'Cualquier texto'],
  ['Verde-gris sobre marfil', paleta.verdeGris, paleta.marfil, 'Cualquier texto'],
  ['Oro sobre marfil', paleta.oro, paleta.marfil, 'Texto grande, íconos, foco'],
  ['Oro sobre verde', paleta.oro, paleta.verde, 'Texto grande, íconos, foco'],
  ['Marfil sobre verde', paleta.marfil, paleta.verde, 'Cualquier texto'],
  [
    'Marfil 75 % sobre verde',
    mezclar(paleta.marfil, paleta.verde, 0.75),
    paleta.verde,
    'Cualquier texto',
  ],
  ['Verde-gris sobre verde', paleta.verdeGris, paleta.verde, 'Prohibido para texto'],
  [
    'Verde sobre vidrio claro (peor caso)',
    paleta.verde,
    mezclar(paleta.marfil, paleta.verde, opacidadVidrio.claro),
    'Cualquier texto',
  ],
  [
    'Marfil sobre vidrio oscuro (peor caso)',
    paleta.marfil,
    mezclar(paleta.verde, paleta.marfil, opacidadVidrio.oscuro),
    'Cualquier texto',
  ],
];

const ESCALA = [
  ['text-display', 'font-titulo', 'Display · 44 → 96 px', inicio.hero.titular],
  ['text-titulo', 'font-titulo', 'Título de sección · 32 → 64 px', inicio.queHacemos.titulo],
  ['text-subtitulo', 'font-titulo', 'Subtítulo · 22 → 32 px', inicio.queHacemos.logicas[0]],
  ['text-titulo', 'font-editorial', 'Editorial · Breve News', inicio.promesa.titulo],
  [
    'text-cuerpo',
    'font-sans',
    'Cuerpo · 17 → 19 px · IBM Plex Sans',
    inicio.pensamosAntes.parrafos[1],
  ],
  ['text-pequeno', 'font-sans', 'Pequeño · 13 → 14 px', firma.posicionamiento],
];

function Seccion({ id, titulo, nota, oscura = false, children }) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className={`espacio-seccion ${oscura ? 'bg-verde text-marfil' : ''}`}
    >
      <div className="contenedor-amplio flex flex-col gap-10">
        <header className="flex flex-col gap-3">
          <h2 id={`${id}-titulo`} className="font-titulo text-titulo">
            {titulo}
          </h2>
          {nota && (
            <p className={`max-w-prose ${oscura ? 'text-marfil/75' : 'text-verde-gris'}`}>{nota}</p>
          )}
        </header>
        {children}
      </div>
    </section>
  );
}

export default function GuiaDeEstilos() {
  const breveActiva = Boolean(breveTitle.variable || breveNews.variable);
  const indice = [
    ['colores', 'Color'],
    ['tipografia', 'Tipografía'],
    ['botones', 'Botones'],
    ['formularios', 'Formularios'],
    ['vidrio', 'Vidrio'],
    ['mosaicos', 'Mosaicos'],
    ['foco', 'Foco'],
    ['imagenes', 'Imágenes'],
    ['animaciones', 'Animación'],
  ];

  return (
    <>
      <section className="contenedor-amplio flex flex-col gap-6 pt-36 pb-12">
        <p className="text-pequeno text-verde-gris">Solo en desarrollo · §9.8</p>
        <h1 className="font-titulo text-display">Guía de estilos</h1>
        <p className="max-w-prose text-verde-gris">
          Tipografía activa:{' '}
          <strong className="font-medium text-verde">
            {breveActiva
              ? 'Breve Sans Title y Breve News'
              : 'respaldo (IBM Plex Sans y serif del sistema)'}
          </strong>
          . Los tokens viven en <code>src/app/globals.css</code>; el plan, en{' '}
          <code>docs/PLAN_DISENO.md</code>.
        </p>
        <nav aria-label="Secciones de la guía">
          <ul className="flex flex-wrap gap-x-6">
            {indice.map(([id, etiqueta]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="subrayado-animado inline-flex min-h-11 items-center text-verde"
                >
                  {etiqueta}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <Seccion
        id="colores"
        titulo="Color"
        nota="Cinco colores y sus tintes. Sin blanco ni negro puros."
      >
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {COLORES.map((c) => (
            <li key={c.nombre} className="flex flex-col gap-3">
              <span className={`h-28 rounded-mosaico border border-verde/10 ${c.clase}`} />
              <span className="font-medium">{c.nombre}</span>
              <span className="text-pequeno text-verde-gris">
                <code>{c.hex}</code> · {c.rol}
              </span>
            </li>
          ))}
        </ul>
        <table className="w-full text-left text-pequeno">
          <caption className="sr-only">Contraste WCAG 2.1 de cada combinación</caption>
          <thead>
            <tr className="border-b border-oro">
              <th className="py-3 font-medium">Combinación</th>
              <th className="py-3 font-medium">Muestra</th>
              <th className="py-3 font-medium">Contraste</th>
              <th className="py-3 font-medium">Uso permitido</th>
            </tr>
          </thead>
          <tbody>
            {PARES.map(([nombre, texto, fondo, uso]) => (
              <tr key={nombre} className="border-b border-verde/10">
                <td className="py-3">{nombre}</td>
                <td className="py-3">
                  <span
                    className="rounded-control px-3 py-1"
                    style={{ color: texto, backgroundColor: fondo }}
                  >
                    Criterio
                  </span>
                </td>
                <td className="py-3 tabular-nums">{contraste(texto, fondo).toFixed(2)}:1</td>
                <td className="py-3 text-verde-gris">{uso}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Seccion>

      <Seccion
        id="tipografia"
        titulo="Tipografía"
        nota="Escala fluida de 320 a 1440 px. Sin mayúsculas sostenidas ni etiquetas sobre los títulos."
      >
        <div className="flex flex-col gap-10">
          {ESCALA.map(([tamano, familia, rotulo, muestra]) => (
            <div key={rotulo} className="flex flex-col gap-2">
              <span className="text-pequeno text-verde-gris">{rotulo}</span>
              <p
                className={`${tamano} ${familia} max-w-[24ch] [&:is(.text-cuerpo,.text-pequeno)]:max-w-prose`}
              >
                {muestra}
              </p>
            </div>
          ))}
        </div>
      </Seccion>

      <Seccion
        id="botones"
        titulo="Botones"
        nota="Píldoras sin flecha. El chevrón queda solo para los enlaces secundarios."
      >
        <div className="flex flex-wrap items-center gap-6">
          <Boton href={rutas.consulta}>{interfaz.acciones.agendeConsulta}</Boton>
          <Boton href={rutas.consulta} tamano="compacto">
            {interfaz.acciones.agendeConsulta}
          </Boton>
          <EnlaceSecundario href={rutas.areas}>{interfaz.acciones.conozcaAreas}</EnlaceSecundario>
        </div>
      </Seccion>

      <Seccion id="botones-oscuro" titulo="Sobre verde profundo" oscura>
        <div className="flex flex-wrap items-center gap-6">
          <Boton href={rutas.consulta} variante="invertido">
            {interfaz.acciones.agendeConsulta}
          </Boton>
          <EnlaceSecundario href={rutas.areas} claro>
            {interfaz.acciones.conozcaAreas}
          </EnlaceSecundario>
        </div>
      </Seccion>

      <Seccion
        id="formularios"
        titulo="Formularios"
        nota="Etiquetas visibles, ayuda y error asociados al campo, error anunciado. El error dice qué pasó y cómo corregirlo."
      >
        <form className="grid max-w-2xl gap-6" noValidate>
          <Campo etiqueta="Nombre" nombre="nombre" obligatorio autoComplete="name" />
          <Campo
            etiqueta="Correo"
            nombre="correo"
            tipo="email"
            obligatorio
            defaultValue="nombre@empresa"
            error="Escriba un correo válido, por ejemplo nombre@empresa.com."
          />
          <Campo
            etiqueta="Área de interés"
            nombre="area"
            tipo="select"
            obligatorio
            opciones={[
              ...areas.map((a) => ({ valor: a.ancla, etiqueta: a.nombre })),
              { valor: 'no-seguro', etiqueta: 'No estoy seguro' },
            ]}
          />
          <Campo etiqueta="Mensaje" nombre="mensaje" tipo="textarea" obligatorio />
          <Casilla nombre="consentimiento" obligatorio>
            Autorizo a Riascos & Barrera el tratamiento de mis datos personales de acuerdo con su{' '}
            <a href="#formularios" className="underline">
              Política de Tratamiento de Datos Personales
            </a>
            .
          </Casilla>
          <Boton type="submit" className="justify-self-start">
            {interfaz.acciones.enviarMensaje}
          </Boton>
        </form>
      </Seccion>

      <Seccion
        id="vidrio"
        titulo="Vidrio"
        nota="Para controles flotantes, nunca para bloques de lectura. Con transparencia reducida o sin soporte de desenfoque, pasa a sólido."
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-contenedor bg-oliva/30 p-10">
            <p aria-hidden="true" className="font-titulo text-display text-verde/60">
              Criterio
            </p>
            <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-pildora border vidrio px-6 py-3">
              <span className="font-medium text-verde">Vidrio claro · marfil 72 %</span>
              <span className="text-oro">›</span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-contenedor bg-marfil p-10 outline outline-verde/10">
            <p aria-hidden="true" className="font-titulo text-display text-oro/60">
              Criterio
            </p>
            <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-pildora border vidrio-oscuro px-6 py-3">
              <span className="font-medium text-marfil">Vidrio oscuro · verde 80 %</span>
              <span className="text-oro">›</span>
            </div>
          </div>
        </div>
      </Seccion>

      <Seccion
        id="mosaicos"
        titulo="Mosaicos"
        nota="Tamaños distintos y sin sombras. Derecho Público es el mayor: A.4.2 lo define como el núcleo de la operación."
      >
        <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2">
          {areas.map((area, i) => (
            <Mosaico
              key={area.ancla}
              href={`${rutas.areas}#${area.ancla}`}
              titulo={area.nombre}
              texto={area.resumen}
              className={
                ['md:col-span-2 md:row-span-2', 'md:col-span-2', 'md:col-span-1', 'md:col-span-1'][
                  i
                ]
              }
            >
              {i === 0 && (
                <Imagen
                  nombre={area.imagen}
                  alt=""
                  className="mt-auto rounded-control"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              )}
            </Mosaico>
          ))}
        </div>
      </Seccion>

      <Seccion
        id="foco"
        titulo="Foco"
        nota="Recorra esta sección con la tecla Tab: el anillo de foco es oro (§12)."
      >
        <div className="flex flex-wrap items-center gap-6">
          <Boton>Botón</Boton>
          <EnlaceSecundario href="#foco">Enlace secundario</EnlaceSecundario>
          <a href="#foco" className="text-verde underline">
            Enlace en texto
          </a>
        </div>
        <Filete />
        <div className="flex flex-col gap-4">
          <span className="text-pequeno text-verde-gris">Logotipos oficiales, sin modificar</span>
          <div className="flex flex-wrap items-end gap-10">
            <Logo className="h-16 w-auto" />
            <Logo variante="escudo" className="h-16 w-auto" />
          </div>
        </div>
      </Seccion>

      <Seccion
        id="imagenes"
        titulo="Imágenes"
        nota="Mientras no haya fotografías, cada espacio conserva su proporción exacta. En producción se ve como un bloque de color, sin texto técnico."
      >
        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <Imagen nombre="inicio-hero" alt="" className="rounded-contenedor" />
          <Imagen nombre="equipo-marcela-riascos-eraso" alt="" className="rounded-contenedor" />
        </div>
        <p className="text-verde-gris">
          Marcador de dato pendiente:{' '}
          <Pendiente valor={firma.contacto.telefono}>{(v) => v}</Pendiente>
        </p>
      </Seccion>

      <Seccion
        id="animaciones"
        titulo="Animación"
        nota="Los seis momentos coreografiados de §9.6. Fuera de ellos, nada se anima al entrar."
      >
        <div className="flex flex-col gap-24">
          <div className="flex flex-col gap-6">
            <h3 className="text-pequeno font-medium text-verde-gris">1 · Entrada del hero</h3>
            <Repetir>
              <div className="flex flex-col gap-6">
                <TitularPorPalabras
                  como="p"
                  texto={inicio.hero.titular}
                  className="font-titulo text-display"
                />
                <Revelar retraso={0.5}>
                  <p className="text-subtitulo text-verde-gris">{inicio.hero.subtitulo}</p>
                </Revelar>
                <Revelar retraso={0.7} className="flex flex-wrap items-center gap-6">
                  <Boton href={rutas.consulta}>{interfaz.acciones.agendeConsulta}</Boton>
                  <EnlaceSecundario href={rutas.areas}>
                    {interfaz.acciones.conozcaAreas}
                  </EnlaceSecundario>
                </Revelar>
                <EntradaImagen className="rounded-contenedor">
                  <Imagen nombre="inicio-hero" alt="" />
                </EntradaImagen>
              </div>
            </Repetir>
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-pequeno font-medium text-verde-gris">
              2 · Qué hacemos: resaltado progresivo
            </h3>
            <p className="max-w-prose">{inicio.queHacemos.introduccion}</p>
            <ResaltadoProgresivo
              lineas={inicio.queHacemos.logicas}
              className="flex flex-col gap-3 py-[20svh]"
              claseLinea="font-titulo text-subtitulo"
            />
          </div>

          <div className="flex flex-col gap-6">
            <h3 className="text-pequeno font-medium text-verde-gris">
              3 · Pensamos antes de litigar: la firma visual
            </h3>
            <SecuenciaVerbos
              titulo={inicio.pensamosAntes.titulo}
              pares={inicio.pensamosAntes.pares}
              encabezados={inicio.pensamosAntes.encabezados}
            />
          </div>

          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <h3 className="text-pequeno font-medium text-verde-gris">
                4 · Método: línea de progreso
              </h3>
              <p className="pt-3 font-titulo text-titulo lg:sticky lg:top-28">
                {inicio.metodo.titulo}
              </p>
            </div>
            <LineaProgreso pasos={inicio.metodo.pasos} />
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-pequeno font-medium text-verde-gris">5 · Barra de navegación</h3>
            <p className="max-w-prose">
              Desplácese: en escritorio la barra se compacta de 72 a 56 px; por debajo de 1024 px se
              oculta al bajar y reaparece al subir. Con movimiento reducido, nunca se oculta.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h3 className="text-pequeno font-medium text-verde-gris">6 · Microinteracciones</h3>
            <p className="max-w-prose">
              Presione los botones (escala 0,97), pase el cursor por los enlaces (subrayado que
              crece, chevrón que avanza) y abra el menú móvil o el buscador desde la barra.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Boton>Presione</Boton>
              <EnlaceSecundario href="#animaciones">Pase el cursor</EnlaceSecundario>
            </div>
          </div>
        </div>
      </Seccion>
    </>
  );
}
