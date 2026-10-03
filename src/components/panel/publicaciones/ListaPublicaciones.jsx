'use client';

import { useState } from 'react';
import Link from 'next/link';
import Boton from '@/components/ui/Boton';
import Campo from '@/components/ui/Campo';
import { rutasPanel } from '@/config/panel';
import { VARIANTES_PORTADA } from '@/config/publicaciones';
import { errores, panel, publicaciones as t } from '@/content/es/panel';
import { useConsulta } from '@/hooks/useConsulta';
import { clientePanel } from '@/lib/panel/cliente';
import { codigoDeError } from '@/lib/panel/errores';
import { estadoDe } from '@/lib/panel/estado';
import { formatearFechaHora } from '@/lib/panel/fechas';
import { BUCKET } from '@/lib/panel/imagenes';
import { sinTildes } from '@/lib/panel/texto';
import Aviso from '../ui/Aviso';
import Confirmacion from '../ui/Confirmacion';
import EncabezadoSeccion from '../ui/EncabezadoSeccion';
import Insignia from '../ui/Insignia';

const CAMPOS = 'id, title, type, status, published_at, deleted_at, updated_at, cover_path';

/** Listado de publicaciones con búsqueda y filtros (§7.2), y la papelera. */
export default function ListaPublicaciones() {
  const [papelera, setPapelera] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('');
  const [estado, setEstado] = useState('');
  const [eliminar, setEliminar] = useState(/** @type {any} */ (null));
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState(
    /** @type {{ tipo: 'exito' | 'error', texto: string } | null} */ (null),
  );

  const { datos, error, cargando, recargar } = useConsulta(() => {
    const consulta = clientePanel()
      .from('posts')
      .select(CAMPOS)
      .order('updated_at', { ascending: false });
    return papelera ? consulta.not('deleted_at', 'is', null) : consulta.is('deleted_at', null);
  }, [papelera]);

  const termino = sinTildes(busqueda.trim().toLowerCase());
  const filas = (datos ?? []).filter(
    (p) =>
      (!termino || sinTildes(p.title.toLowerCase()).includes(termino)) &&
      (!tipo || p.type === tipo) &&
      (!estado || estadoDe(p) === estado),
  );

  async function restaurar(p) {
    setAviso(null);
    const { error: fallo } = await clientePanel()
      .from('posts')
      .update({ deleted_at: null, status: 'borrador' })
      .eq('id', p.id);
    setAviso(
      fallo
        ? { tipo: 'error', texto: errores[codigoDeError(fallo)] }
        : { tipo: 'exito', texto: t.restaurada },
    );
    recargar();
  }

  async function eliminarDefinitivo() {
    setOcupado(true);
    const cliente = clientePanel();
    const { error: fallo } = await cliente.from('posts').delete().eq('id', eliminar.id);
    if (!fallo && eliminar.cover_path) {
      // La portada solo pertenece a esta publicación: se borran sus dos variantes.
      await cliente.storage
        .from(BUCKET)
        .remove([
          eliminar.cover_path,
          eliminar.cover_path.replace(VARIANTES_PORTADA.grande, VARIANTES_PORTADA.mediana),
        ]);
    }
    setOcupado(false);
    setEliminar(null);
    setAviso(fallo ? { tipo: 'error', texto: errores[codigoDeError(fallo)] } : null);
    recargar();
  }

  const hayFiltros = busqueda || tipo || estado;

  return (
    <>
      <EncabezadoSeccion titulo={papelera ? `${t.titulo}: ${t.papelera}` : t.titulo}>
        <Boton variante="contorno" tamano="compacto" onClick={() => setPapelera((p) => !p)}>
          {papelera ? t.verActivas : t.verPapelera}
        </Boton>
        {!papelera && (
          <Boton href={rutasPanel.editarPublicacion} tamano="compacto">
            {t.nueva}
          </Boton>
        )}
      </EncabezadoSeccion>

      <div className="grid gap-x-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
        <Campo
          etiqueta={t.buscar}
          nombre="buscar"
          tipo="search"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <Campo
          etiqueta={t.tipo}
          nombre="tipo"
          tipo="select"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          opciones={[
            { valor: '', etiqueta: panel.todos },
            { valor: 'articulo', etiqueta: t.articulo },
            { valor: 'caso', etiqueta: t.caso },
          ]}
        />
        {!papelera && (
          <Campo
            etiqueta={t.estado}
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
        <div className="flex flex-col items-start gap-3">
          <p className="text-verde-gris">
            {hayFiltros ? panel.sinCoincidencias : papelera ? t.papeleraVacia : t.vacia}
          </p>
          {hayFiltros && (
            <Boton
              variante="contorno"
              tamano="compacto"
              onClick={() => {
                setBusqueda('');
                setTipo('');
                setEstado('');
              }}
            >
              {panel.quitarFiltros}
            </Boton>
          )}
        </div>
      )}

      {filas.length > 0 && (
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left">
            <thead className="border-b border-verde/20 text-pequeno text-verde-gris">
              <tr>
                <th scope="col" className="py-3 pr-4 font-medium">
                  {t.campoTitulo}
                </th>
                <th scope="col" className="py-3 pr-4 font-medium">
                  {t.tipo}
                </th>
                <th scope="col" className="py-3 pr-4 font-medium">
                  {t.estado}
                </th>
                <th scope="col" className="py-3 pr-4 font-medium">
                  {t.fecha}
                </th>
                <th scope="col" className="py-3 font-medium">
                  {papelera ? <span className="sr-only">{t.restaurar}</span> : t.actualizada}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-verde/10">
              {filas.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 pr-4">
                    {papelera ? (
                      <span className="font-medium">{p.title}</span>
                    ) : (
                      <Link
                        href={`${rutasPanel.editarPublicacion}?id=${p.id}`}
                        className="inline-flex min-h-11 items-center font-medium underline-offset-4 hover:underline"
                      >
                        {p.title}
                      </Link>
                    )}
                  </td>
                  <td className="py-3 pr-4">{p.type === 'caso' ? t.caso : t.articulo}</td>
                  <td className="py-3 pr-4">
                    <Insignia estado={estadoDe(p)} />
                  </td>
                  <td className="py-3 pr-4 text-pequeno whitespace-nowrap">
                    {formatearFechaHora(p.published_at)}
                  </td>
                  <td className="py-3 text-pequeno whitespace-nowrap">
                    {papelera ? (
                      <span className="flex gap-2">
                        <Boton variante="contorno" tamano="compacto" onClick={() => restaurar(p)}>
                          {t.restaurar}
                        </Boton>
                        <Boton variante="contorno" tamano="compacto" onClick={() => setEliminar(p)}>
                          {t.eliminarDefinitivo}
                        </Boton>
                      </span>
                    ) : (
                      formatearFechaHora(p.updated_at)
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
        titulo={eliminar ? t.confirmarEliminar(eliminar.title) : ''}
        texto={t.eliminarAviso}
        confirmar={t.eliminarDefinitivo}
        alConfirmar={eliminarDefinitivo}
        ocupado={ocupado}
      />
    </>
  );
}
