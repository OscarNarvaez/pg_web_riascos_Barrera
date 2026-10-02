import Link from 'next/link';
import Logo from '@/components/Logo';
import Pendiente from '@/components/Pendiente';
import Filete from '@/components/ui/Filete';
import { firma } from '@/config/firma';
import { navegacionPrincipal, rutas } from '@/config/rutas';
import { interfaz } from '@/content/es/interfaz';
import { esPendiente, MOSTRAR_PENDIENTES } from '@/lib/pendientes';

const titulo = 'text-pequeno font-medium text-verde-gris';
const enlace = 'subrayado-animado inline-flex min-h-11 items-center text-verde';

/**
 * Pie de página (§4.3). En marfil, no en verde: el logotipo entregado tiene el nombre en verde y
 * desaparecería sobre verde profundo (plan de diseño §8). Los canales sin confirmar no se
 * muestran en producción (§14.4).
 */
export default function PiePagina() {
  const { direccion: d, contacto: c } = firma;
  const t = interfaz.pie;
  const anio = new Date().getFullYear();

  // En producción solo se listan los canales confirmados; si no hay ninguno, la columna no existe.
  const canales = [
    { clave: 'telefono', valor: c.telefono, enlace: (v) => `tel:${v.replace(/\s/g, '')}` },
    { clave: 'correo', valor: c.correo, enlace: (v) => `mailto:${v}` },
  ].filter((canal) => MOSTRAR_PENDIENTES || !esPendiente(canal.valor));

  return (
    <footer className="pb-[max(2rem,env(safe-area-inset-bottom))]">
      <div className="contenedor-amplio flex flex-col gap-12 pt-16">
        <Filete />

        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex flex-col gap-5">
            <Logo className="h-12 w-auto self-start" />
            <p className="text-pequeno text-verde-gris">{firma.posicionamiento}</p>
            <address className="text-pequeno text-verde not-italic">
              {d.edificio}, {d.oficina}
              <br />
              {d.calle}
              <br />
              {d.ciudad}, {d.departamento}, {d.pais}
            </address>
          </div>

          <nav aria-label={t.navegacion} className="flex flex-col gap-2">
            <h2 className={titulo}>{t.navegacion}</h2>
            <ul>
              {navegacionPrincipal.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={enlace}>
                    {item.etiqueta}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={rutas.lecturas} className={enlace}>
                  {t.lecturas}
                </Link>
              </li>
            </ul>
          </nav>

          {canales.length > 0 && (
            <div className="flex flex-col gap-2">
              <h2 className={titulo}>{t.contacto}</h2>
              <ul>
                {canales.map((canal) => (
                  <li key={canal.clave}>
                    <Pendiente valor={canal.valor}>
                      {(valor) => (
                        <a href={canal.enlace(valor)} className={enlace}>
                          {valor}
                        </a>
                      )}
                    </Pendiente>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 text-pequeno text-verde-gris sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {anio} {firma.nombre}. {t.derechos}
          </p>
          <ul className="flex flex-wrap gap-x-6">
            <li>
              <Link href={rutas.privacidad} className={enlace}>
                {t.privacidad}
              </Link>
            </li>
            <li>
              <Link href={rutas.tratamientoDatos} className={enlace}>
                {t.tratamientoDatos}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
