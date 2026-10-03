'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Boton from '@/components/ui/Boton';
import Campo from '@/components/ui/Campo';
import { LIMITE_CONTACTOS, rutasPanel } from '@/config/panel';
import { comoNosConocio, tiposDeFormulario } from '@/content/es/captacion';
import { contactos as t, errores, panel } from '@/content/es/panel';
import { useConsulta } from '@/hooks/useConsulta';
import { clientePanel } from '@/lib/panel/cliente';
import { aCsv, descargar } from '@/lib/panel/csv';
import { limiteDelDia } from '@/lib/panel/fechas';
import Aviso from '../ui/Aviso';
import EncabezadoSeccion from '../ui/EncabezadoSeccion';
import { COLUMNAS_CSV, valorDe } from './columnas';

const SIN_FILTROS = {
  desde: '',
  hasta: '',
  formulario: '',
  origen: '',
  referente: '',
  campana: '',
  estado: '',
};

/** Valores distintos y no vacíos de un campo, ordenados. */
function distintos(filas, campo) {
  return [...new Set(filas.map((f) => f[campo]).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'es'),
  );
}

/**
 * Contactos (§7.2, solo admin): filtros por fecha, formulario, cómo nos conoció, referente,
 * campaña y estado; exportación a CSV en el navegador de lo filtrado.
 */
export default function ListaContactos() {
  const [filtros, setFiltros] = useState(SIN_FILTROS);
  const cambiar = (cambios) => setFiltros((f) => ({ ...f, ...cambios }));

  // Las fechas se filtran en la base; el resto, en el navegador sobre lo cargado.
  const { datos, error, cargando } = useConsulta(() => {
    let consulta = clientePanel()
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(LIMITE_CONTACTOS);
    const desde = limiteDelDia(filtros.desde);
    const hasta = limiteDelDia(filtros.hasta, { fin: true });
    if (desde) consulta = consulta.gte('created_at', desde);
    if (hasta) consulta = consulta.lte('created_at', hasta);
    return consulta;
  }, [filtros.desde, filtros.hasta]);

  const todas = useMemo(() => datos ?? [], [datos]);
  const filas = todas.filter(
    (c) =>
      (!filtros.formulario || c.form_type === filtros.formulario) &&
      (!filtros.origen || c.how_found === filtros.origen) &&
      (!filtros.referente || c.referral_code === filtros.referente) &&
      (!filtros.campana || c.utm_campaign === filtros.campana) &&
      (!filtros.estado || c.status === filtros.estado),
  );
  const hayFiltros = Object.values(filtros).some(Boolean);
  const todos = { valor: '', etiqueta: panel.todos };

  function exportar() {
    const fecha = new Date().toISOString().slice(0, 10);
    descargar(aCsv(filas, COLUMNAS_CSV), `contactos-${fecha}.csv`);
  }

  return (
    <>
      <EncabezadoSeccion titulo={t.titulo}>
        {filas.length > 0 && (
          <Boton tamano="compacto" onClick={exportar} aria-describedby="ayuda-exportar">
            {t.exportar}
          </Boton>
        )}
      </EncabezadoSeccion>

      <div className="grid gap-x-4 sm:grid-cols-2 lg:grid-cols-4">
        <Campo
          etiqueta={t.desde}
          nombre="desde"
          tipo="date"
          value={filtros.desde}
          onChange={(e) => cambiar({ desde: e.target.value })}
        />
        <Campo
          etiqueta={t.hasta}
          nombre="hasta"
          tipo="date"
          value={filtros.hasta}
          onChange={(e) => cambiar({ hasta: e.target.value })}
        />
        <Campo
          etiqueta={t.formulario}
          nombre="formulario"
          tipo="select"
          value={filtros.formulario}
          onChange={(e) => cambiar({ formulario: e.target.value })}
          opciones={[todos, ...tiposDeFormulario]}
        />
        <Campo
          etiqueta={t.origen}
          nombre="origen"
          tipo="select"
          value={filtros.origen}
          onChange={(e) => cambiar({ origen: e.target.value })}
          opciones={[todos, ...comoNosConocio]}
        />
        <Campo
          etiqueta={t.referente}
          nombre="referente"
          tipo="select"
          value={filtros.referente}
          onChange={(e) => cambiar({ referente: e.target.value })}
          opciones={[
            todos,
            ...distintos(todas, 'referral_code').map((v) => ({ valor: v, etiqueta: v })),
          ]}
        />
        <Campo
          etiqueta={t.campana}
          nombre="campana"
          tipo="select"
          value={filtros.campana}
          onChange={(e) => cambiar({ campana: e.target.value })}
          opciones={[
            todos,
            ...distintos(todas, 'utm_campaign').map((v) => ({ valor: v, etiqueta: v })),
          ]}
        />
        <Campo
          etiqueta={t.estado}
          nombre="estado"
          tipo="select"
          value={filtros.estado}
          onChange={(e) => cambiar({ estado: e.target.value })}
          opciones={[
            todos,
            ...Object.entries(t.estados).map(([valor, etiqueta]) => ({ valor, etiqueta })),
          ]}
        />
        {hayFiltros && (
          <div className="flex items-center pb-6">
            <Boton variante="contorno" tamano="compacto" onClick={() => setFiltros(SIN_FILTROS)}>
              {panel.quitarFiltros}
            </Boton>
          </div>
        )}
      </div>

      <Aviso tipo="error">{error && errores[error]}</Aviso>
      {cargando && <p role="status">{panel.cargando}</p>}
      {todas.length === LIMITE_CONTACTOS && <Aviso>{t.limite(LIMITE_CONTACTOS)}</Aviso>}
      {filas.length > 0 && (
        <p id="ayuda-exportar" className="text-pequeno text-verde-gris">
          {t.exportarAyuda(filas.length)}
        </p>
      )}
      {!cargando && !error && filas.length === 0 && (
        <p className="text-verde-gris">{hayFiltros ? panel.sinCoincidencias : t.vacia}</p>
      )}

      {filas.length > 0 && (
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[48rem] border-collapse text-left">
            <thead className="border-b border-verde/20 text-pequeno text-verde-gris">
              <tr>
                {['created_at', 'name', 'form_type', 'how_found', 'referral_code', 'status'].map(
                  (c) => (
                    <th key={c} scope="col" className="py-3 pr-4 font-medium">
                      {t.campos[c]}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-verde/10">
              {filas.map((c) => (
                <tr key={c.id}>
                  <td className="py-3 pr-4 text-pequeno whitespace-nowrap">
                    {valorDe('created_at', c)}
                  </td>
                  <td className="py-3 pr-4">
                    <Link
                      href={`${rutasPanel.detalleContacto}?id=${c.id}`}
                      aria-label={t.verDetalle(c.name)}
                      className="inline-flex min-h-11 items-center font-medium [overflow-wrap:anywhere] underline-offset-4 hover:underline"
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">{valorDe('form_type', c)}</td>
                  <td className="py-3 pr-4">{valorDe('how_found', c)}</td>
                  <td className="py-3 pr-4">{c.referral_code ?? ''}</td>
                  <td className="py-3">{valorDe('status', c)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
