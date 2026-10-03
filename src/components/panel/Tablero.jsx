'use client';

import Link from 'next/link';
import Boton from '@/components/ui/Boton';
import EnlaceSecundario from '@/components/ui/EnlaceSecundario';
import { rutasPanel } from '@/config/panel';
import { comoNosConocio, etiquetaDe } from '@/content/es/captacion';
import { errores, publicaciones as tp, sitio, tablero as t } from '@/content/es/panel';
import { useConsulta } from '@/hooks/useConsulta';
import { clientePanel } from '@/lib/panel/cliente';
import { estadoDe } from '@/lib/panel/estado';
import { formatearFechaHora } from '@/lib/panel/fechas';
import { contarPor, DIAS_DEL_TABLERO, haceDias } from '@/lib/panel/tablero';
import ActualizarSitio from './ActualizarSitio';
import { useSesion } from './sesion/ProveedorSesion';
import Aviso from './ui/Aviso';
import EncabezadoSeccion from './ui/EncabezadoSeccion';
import Insignia from './ui/Insignia';

/** @param {{ titulo: string, filas: { valor: string | null, total: number }[], vacio: string, etiqueta?: (v: string) => string }} props */
function Desglose({ titulo, filas, vacio, etiqueta = (v) => v }) {
  return (
    <div className="flex flex-col gap-3 rounded-mosaico bg-oliva/15 p-5">
      <h3 className="font-medium">{titulo}</h3>
      <dl className="flex flex-col gap-1.5">
        {filas.map((f) => (
          <div key={f.valor ?? '—'} className="flex justify-between gap-4">
            <dt className="min-w-0 [overflow-wrap:anywhere]">
              {f.valor ? etiqueta(f.valor) : vacio}
            </dt>
            <dd className="font-medium tabular-nums">{f.total}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ContactosRecientes() {
  const { datos, error, cargando } = useConsulta(
    () =>
      clientePanel()
        .from('leads')
        .select('how_found, referral_code, utm_campaign')
        .gte('created_at', haceDias(DIAS_DEL_TABLERO)),
    [],
  );
  const filas = datos ?? [];

  return (
    <section aria-labelledby="tablero-contactos" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 id="tablero-contactos" className="font-titulo text-subtitulo">
          {t.contactos}
        </h2>
        {!cargando && !error && (
          <p className="text-subtitulo font-medium">{t.total(filas.length)}</p>
        )}
      </div>
      <Aviso tipo="error">{error && errores[error]}</Aviso>
      {!cargando && !error && filas.length === 0 && (
        <p className="text-verde-gris">{t.sinContactos}</p>
      )}
      {filas.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          <Desglose
            titulo={t.porOrigen}
            filas={contarPor(filas, (f) => f.how_found)}
            vacio={t.sinDato}
            etiqueta={(v) => etiquetaDe(comoNosConocio, v)}
          />
          <Desglose
            titulo={t.porReferente}
            filas={contarPor(filas, (f) => f.referral_code)}
            vacio={t.sinReferente}
          />
          <Desglose
            titulo={t.porCampana}
            filas={contarPor(filas, (f) => f.utm_campaign)}
            vacio={t.sinCampana}
          />
        </div>
      )}
      <EnlaceSecundario href={rutasPanel.contactos}>{t.verContactos}</EnlaceSecundario>
    </section>
  );
}

function PublicacionesRecientes() {
  const { datos, error, cargando } = useConsulta(
    () =>
      clientePanel()
        .from('posts')
        .select('id, title, status, published_at, deleted_at, updated_at')
        .is('deleted_at', null)
        .order('updated_at', { ascending: false })
        .limit(5),
    [],
  );

  return (
    <section aria-labelledby="tablero-publicaciones" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="tablero-publicaciones" className="font-titulo text-subtitulo">
          {t.recientes}
        </h2>
        <Boton href={rutasPanel.editarPublicacion} tamano="compacto">
          {tp.nueva}
        </Boton>
      </div>
      <Aviso tipo="error">{error && errores[error]}</Aviso>
      {!cargando && !error && (datos ?? []).length === 0 && (
        <p className="text-verde-gris">{t.sinPublicaciones}</p>
      )}
      {(datos ?? []).length > 0 && (
        <ul className="flex flex-col divide-y divide-verde/10 border-y border-verde/10">
          {datos.map((p) => (
            <li
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3"
            >
              <Link
                href={`${rutasPanel.editarPublicacion}?id=${p.id}`}
                className="min-h-11 min-w-0 flex-1 content-center font-medium [overflow-wrap:anywhere] underline-offset-4 hover:underline"
              >
                {p.title}
              </Link>
              <span className="flex items-center gap-4 text-pequeno text-verde-gris">
                {formatearFechaHora(p.updated_at)}
                <Insignia estado={estadoDe(p)} />
              </span>
            </li>
          ))}
        </ul>
      )}
      <EnlaceSecundario href={rutasPanel.publicaciones}>{t.verPublicaciones}</EnlaceSecundario>
    </section>
  );
}

/** Tablero (§7.2). */
export default function Tablero() {
  const { esAdmin } = useSesion();
  return (
    <>
      <EncabezadoSeccion titulo={t.titulo} />
      {esAdmin && <ContactosRecientes />}
      <PublicacionesRecientes />
      <section aria-labelledby="tablero-sitio" className="flex flex-col gap-4">
        <h2 id="tablero-sitio" className="font-titulo text-subtitulo">
          {sitio.titulo}
        </h2>
        <p className="max-w-prose text-verde-gris">{sitio.texto}</p>
        <ActualizarSitio />
      </section>
    </>
  );
}
