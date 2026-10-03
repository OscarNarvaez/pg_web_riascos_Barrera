'use client';

import { useState } from 'react';
import Link from 'next/link';
import Boton from '@/components/ui/Boton';
import Campo from '@/components/ui/Campo';
import { rutasPanel } from '@/config/panel';
import { errores, lecturas as t, panel, publicaciones as tp } from '@/content/es/panel';
import { useConsulta } from '@/hooks/useConsulta';
import { clientePanel } from '@/lib/panel/cliente';
import { codigoDeError } from '@/lib/panel/errores';
import { estadoDe } from '@/lib/panel/estado';
import { formatearFechaHora } from '@/lib/panel/fechas';
import { sinTildes } from '@/lib/panel/texto';
import Aviso from '../ui/Aviso';
import Confirmacion from '../ui/Confirmacion';
import EncabezadoSeccion from '../ui/EncabezadoSeccion';
import Insignia from '../ui/Insignia';

/** Listado de lecturas recomendadas (§7.2), con búsqueda, filtro de estado y papelera. */
export default function ListaLecturas() {
  const [papelera, setPapelera] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');
  const [eliminar, setEliminar] = useState(/** @type {any} */ (null));
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState(
    /** @type {{ tipo: 'exito' | 'error', texto: string } | null} */ (null),
  );

  const { datos, error, cargando, recargar } = useConsulta(() => {
    const consulta = clientePanel()
      .from('external_reads')
      .select('id, title, source_name, status, published_at, deleted_at, updated_at')
      .order('updated_at', { ascending: false });
    return papelera ? consulta.not('deleted_at', 'is', null) : consulta.is('deleted_at', null);
  }, [papelera]);

  const termino = sinTildes(busqueda.trim().toLowerCase());
  const filas = (datos ?? []).filter(
    (l) =>
      (!termino || sinTildes(`${l.title} ${l.source_name}`.toLowerCase()).includes(termino)) &&
      (!estado || estadoDe(l) === estado),
  );

  async function restaurar(l) {
    const { error: fallo } = await clientePanel()
      .from('external_reads')
      .update({ deleted_at: null, status: 'borrador' })
      .eq('id', l.id);
    setAviso(
      fallo
        ? { tipo: 'error', texto: errores[codigoDeError(fallo)] }
        : { tipo: 'exito', texto: t.restaurada },
    );
    recargar();
  }

  async function eliminarDefinitivo() {
    setOcupado(true);
    const { error: fallo } = await clientePanel()
      .from('external_reads')
      .delete()
      .eq('id', eliminar.id);
    setOcupado(false);
    setEliminar(null);
    setAviso(fallo ? { tipo: 'error', texto: errores[codigoDeError(fallo)] } : null);
    recargar();
  }

  return (
    <>
      <EncabezadoSeccion titulo={papelera ? `${t.titulo}: ${tp.papelera}` : t.titulo}>
        <Boton variante="contorno" tamano="compacto" onClick={() => setPapelera((p) => !p)}>
          {papelera ? tp.verActivas : tp.verPapelera}
        </Boton>
        {!papelera && (
          <Boton href={rutasPanel.editarLectura} tamano="compacto">
            {t.nueva}
          </Boton>
        )}
      </EncabezadoSeccion>

      <div className="grid gap-x-4 sm:grid-cols-[2fr_1fr]">
        <Campo
          etiqueta={t.buscar}
          nombre="buscar"
          tipo="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {!papelera && (
          <Campo
            etiqueta={tp.estado}
            nombre="estado"
            tipo="select"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            opciones={[
              { valor: '', etiqueta: panel.todos },
              ...['borrador', 'programada', 'publicada'].map((v) => ({
                valor: v,
                etiqueta: panel.estados[v],
              })),
            ]}
          />
        )}
      </div>

      {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
      <Aviso tipo="error">{error && errores[error]}</Aviso>
      {cargando && <p role="status">{panel.cargando}</p>}
      {!cargando && !error && filas.length === 0 && (
        <p className="text-verde-gris">
          {busqueda || estado ? panel.sinCoincidencias : papelera ? tp.papeleraVacia : t.vacia}
        </p>
      )}

      {filas.length > 0 && (
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[36rem] border-collapse text-left">
            <thead className="border-b border-verde/20 text-pequeno text-verde-gris">
              <tr>
                <th scope="col" className="py-3 pr-4 font-medium">
                  {t.campoTitulo}
                </th>
                <th scope="col" className="py-3 pr-4 font-medium">
                  {t.fuente}
                </th>
                <th scope="col" className="py-3 pr-4 font-medium">
                  {tp.estado}
                </th>
                <th scope="col" className="py-3 font-medium">
                  {papelera ? <span className="sr-only">{tp.restaurar}</span> : tp.fecha}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-verde/10">
              {filas.map((l) => (
                <tr key={l.id}>
                  <td className="py-3 pr-4">
                    {papelera ? (
                      <span className="font-medium">{l.title}</span>
                    ) : (
                      <Link
                        href={`${rutasPanel.editarLectura}?id=${l.id}`}
                        className="inline-flex min-h-11 items-center font-medium underline-offset-4 hover:underline"
                      >
                        {l.title}
                      </Link>
                    )}
                  </td>
                  <td className="py-3 pr-4">{l.source_name}</td>
                  <td className="py-3 pr-4">
                    <Insignia estado={estadoDe(l)} />
                  </td>
                  <td className="py-3 text-pequeno whitespace-nowrap">
                    {papelera ? (
                      <span className="flex gap-2">
                        <Boton variante="contorno" tamano="compacto" onClick={() => restaurar(l)}>
                          {tp.restaurar}
                        </Boton>
                        <Boton variante="contorno" tamano="compacto" onClick={() => setEliminar(l)}>
                          {tp.eliminarDefinitivo}
                        </Boton>
                      </span>
                    ) : (
                      formatearFechaHora(l.published_at)
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Confirmacion
        abierto={Boolean(eliminar)}
        alCerrar={() => setEliminar(null)}
        titulo={eliminar ? tp.confirmarEliminar(eliminar.title) : ''}
        texto={tp.eliminarAviso}
        confirmar={tp.eliminarDefinitivo}
        alConfirmar={eliminarDefinitivo}
        ocupado={ocupado}
      />
    </>
  );
}
