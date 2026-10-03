'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Boton from '@/components/ui/Boton';
import Campo from '@/components/ui/Campo';
import EnlaceSecundario from '@/components/ui/EnlaceSecundario';
import { rutasPanel } from '@/config/panel';
import {
  errores,
  lecturas as t,
  mensajeCampo,
  panel,
  publicaciones as tp,
} from '@/content/es/panel';
import { clientePanel } from '@/lib/panel/cliente';
import { codigoDeError } from '@/lib/panel/errores';
import { estadoDe } from '@/lib/panel/estado';
import { aEntradaBogota, deEntradaBogota, formatearFechaHora } from '@/lib/panel/fechas';
import { LIMITES, validarLectura } from '@/lib/panel/validacion';
import ActualizarSitio from '../ActualizarSitio';
import { avisoTrasGuardar, sincronizarEtiquetas } from '../guardado';
import Aviso from '../ui/Aviso';
import Confirmacion from '../ui/Confirmacion';
import EncabezadoSeccion from '../ui/EncabezadoSeccion';
import Insignia from '../ui/Insignia';
import SelectorEtiquetas from '../ui/SelectorEtiquetas';

const VACIA = { titulo: '', fuente: '', url: '', comentario: '', etiquetas: [], fecha: '' };

/**
 * Crear y editar una lectura recomendada (§5.5 y §7.2). Solo título, fuente, enlace y un
 * comentario de la firma: nunca el contenido del artículo externo (regla 9).
 */
export default function EditorLectura() {
  const router = useRouter();
  const id = useSearchParams().get('id');
  const [carga, setCarga] = useState('cargando');
  const [f, setF] = useState(VACIA);
  const [fila, setFila] = useState(/** @type {any} */ (null));
  const [todasEtiquetas, setTodasEtiquetas] = useState([]);
  const [erroresCampos, setErroresCampos] = useState(/** @type {Record<string, string>} */ ({}));
  const [aviso, setAviso] = useState(
    /** @type {import('../guardado').AvisoGuardado | null} */ (null),
  );
  const [ocupado, setOcupado] = useState(false);
  const [confirmar, setConfirmar] = useState(
    /** @type {null | 'despublicar' | 'papelera'} */ (null),
  );

  useEffect(() => {
    let vigente = true;
    const cliente = clientePanel();
    Promise.all([
      cliente.from('tags').select('id, name').order('name'),
      id
        ? cliente
            .from('external_reads')
            .select('*, external_read_tags(tag_id)')
            .eq('id', id)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]).then(([etiquetas, lectura]) => {
      if (!vigente) return;
      if (etiquetas.error || lectura.error) return setCarga('error');
      setTodasEtiquetas(etiquetas.data ?? []);
      if (id && !lectura.data) return setCarga('no-existe');
      if (lectura.data) {
        const l = lectura.data;
        setFila(l);
        setF({
          titulo: l.title,
          fuente: l.source_name,
          url: l.url,
          comentario: l.comment ?? '',
          etiquetas: (l.external_read_tags ?? []).map((r) => r.tag_id),
          fecha: aEntradaBogota(l.published_at),
        });
      }
      setCarga('lista');
    });
    return () => {
      vigente = false;
    };
  }, [id]);

  const cambiar = (cambios) => {
    setF((actual) => ({ ...actual, ...cambios }));
    setAviso(null);
  };

  const fechaIso = f.fecha ? deEntradaBogota(f.fecha) : null;
  const futura = fechaIso !== null && new Date(fechaIso) > new Date();
  const estado = fila ? estadoDe(fila) : 'borrador';
  const publicada = fila?.status === 'publicado';

  /** @param {'guardar' | 'publicar' | 'despublicar' | 'papelera'} accion */
  async function guardar(accion) {
    const encontrados = validarLectura(
      { ...f, fechaInvalida: Boolean(f.fecha) && !fechaIso },
      { publicar: accion === 'publicar' || publicada },
    );
    setErroresCampos(encontrados);
    if (Object.keys(encontrados).length) {
      setAviso({ tipo: 'error', texto: panel.revisarCampos });
      return;
    }
    setOcupado(true);
    const cliente = clientePanel();
    const ahora = new Date().toISOString();
    /** @type {Record<string, any>} */
    const datos = {
      title: f.titulo.trim(),
      source_name: f.fuente.trim(),
      url: f.url.trim(),
      comment: f.comentario.trim() || null,
    };
    if (accion === 'publicar')
      Object.assign(datos, { status: 'publicado', published_at: fechaIso ?? ahora });
    else if (accion === 'despublicar') datos.status = 'borrador';
    else if (accion === 'papelera') datos.deleted_at = ahora;
    else datos.published_at = fechaIso ?? (publicada ? fila.published_at : null);

    const consulta = fila
      ? cliente.from('external_reads').update(datos).eq('id', fila.id)
      : cliente.from('external_reads').insert(datos);
    const { data: guardada, error } = await consulta
      .select('*, external_read_tags(tag_id)')
      .single();
    if (error) {
      setAviso({ tipo: 'error', texto: errores[codigoDeError(error)] ?? errores.desconocido });
      setOcupado(false);
      return;
    }
    try {
      await sincronizarEtiquetas(
        cliente,
        'external_read_tags',
        'external_read_id',
        guardada.id,
        (fila?.external_read_tags ?? []).map((r) => r.tag_id),
        f.etiquetas,
      );
    } catch (fallo) {
      setAviso({ tipo: 'error', texto: errores[codigoDeError(fallo)] ?? errores.desconocido });
      setOcupado(false);
      return;
    }
    const actualizada = {
      ...guardada,
      external_read_tags: f.etiquetas.map((tag_id) => ({ tag_id })),
    };
    const nuevoAviso = await avisoTrasGuardar(fila, actualizada);
    setFila(actualizada);
    setOcupado(false);
    setConfirmar(null);
    if (accion === 'papelera') {
      router.push(rutasPanel.lecturas);
      return;
    }
    setAviso(nuevoAviso);
    if (!fila) router.replace(`${rutasPanel.editarLectura}?id=${guardada.id}`);
  }

  if (carga === 'cargando') return <p role="status">{panel.cargando}</p>;
  if (carga !== 'lista') {
    return (
      <>
        <EncabezadoSeccion titulo={t.tituloEditar} />
        <Aviso tipo="error">{carga === 'no-existe' ? t.noExiste : errores.red}</Aviso>
        <EnlaceSecundario href={rutasPanel.lecturas}>{t.volver}</EnlaceSecundario>
      </>
    );
  }

  return (
    <>
      <EncabezadoSeccion
        titulo={fila ? t.tituloEditar : t.tituloNueva}
        antes={<EnlaceSecundario href={rutasPanel.lecturas}>{t.volver}</EnlaceSecundario>}
      >
        {fila && <Insignia estado={estado} />}
      </EncabezadoSeccion>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-2">
          <Campo
            etiqueta={t.campoTitulo}
            nombre="titulo"
            value={f.titulo}
            onChange={(e) => cambiar({ titulo: e.target.value })}
            obligatorio
            error={mensajeCampo(erroresCampos.titulo)}
          />
          <Campo
            etiqueta={t.fuente}
            nombre="fuente"
            value={f.fuente}
            onChange={(e) => cambiar({ fuente: e.target.value })}
            obligatorio
            ayuda={t.fuenteAyuda}
            error={mensajeCampo(erroresCampos.fuente)}
          />
          <Campo
            etiqueta={t.url}
            nombre="url"
            tipo="url"
            value={f.url}
            onChange={(e) => cambiar({ url: e.target.value })}
            obligatorio
            error={mensajeCampo(erroresCampos.url)}
          />
          <Campo
            etiqueta={t.comentario}
            nombre="comentario"
            tipo="textarea"
            rows={4}
            value={f.comentario}
            onChange={(e) => cambiar({ comentario: e.target.value })}
            ayuda={`${t.comentarioAyuda} ${panel.contador(f.comentario.length, LIMITES.comentario)}`}
            error={mensajeCampo(erroresCampos.comentario, 'comentario')}
          />
          <SelectorEtiquetas
            etiquetas={todasEtiquetas}
            seleccion={f.etiquetas}
            alCambiar={(etiquetas) => cambiar({ etiquetas })}
          />
        </div>

        <aside
          aria-label={tp.publicacion}
          className="flex flex-col gap-5 self-start rounded-mosaico bg-oliva/15 p-5"
        >
          <h2 className="font-titulo text-subtitulo">{tp.publicacion}</h2>
          <p className="text-pequeno">
            {estado === 'publicada'
              ? tp.publicadaEl(formatearFechaHora(fila.published_at))
              : estado === 'programada'
                ? tp.programadaPara(formatearFechaHora(fila.published_at))
                : tp.esBorrador}
          </p>
          <Campo
            etiqueta={tp.fechaCampo}
            nombre="fecha"
            tipo="datetime-local"
            value={f.fecha}
            onChange={(e) => cambiar({ fecha: e.target.value })}
            ayuda={tp.fechaAyuda}
            error={mensajeCampo(erroresCampos.fecha)}
          />
          <div className="flex flex-col gap-3">
            {estado !== 'papelera' && !publicada && (
              <Boton onClick={() => guardar('publicar')} disabled={ocupado} anchoCompleto>
                {futura ? tp.programar : tp.publicar}
              </Boton>
            )}
            <Boton
              variante={publicada ? 'principal' : 'contorno'}
              onClick={() => guardar('guardar')}
              disabled={ocupado}
              anchoCompleto
            >
              {ocupado ? panel.guardando : publicada ? tp.guardar : tp.guardarBorrador}
            </Boton>
            {publicada && estado !== 'papelera' && (
              <Boton variante="contorno" onClick={() => setConfirmar('despublicar')} anchoCompleto>
                {tp.despublicar}
              </Boton>
            )}
            {fila && estado !== 'papelera' && (
              <Boton variante="contorno" onClick={() => setConfirmar('papelera')} anchoCompleto>
                {tp.enviarPapelera}
              </Boton>
            )}
          </div>
          {aviso && (
            <div className="flex flex-col gap-3">
              <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>
              {aviso.actualizar && <ActualizarSitio compacto />}
            </div>
          )}
        </aside>
      </div>

      <Confirmacion
        abierto={confirmar === 'despublicar'}
        alCerrar={() => setConfirmar(null)}
        titulo={t.confirmarDespublicar}
        texto={t.despublicarAviso}
        confirmar={tp.despublicar}
        alConfirmar={() => guardar('despublicar')}
        ocupado={ocupado}
      />
      <Confirmacion
        abierto={confirmar === 'papelera'}
        alCerrar={() => setConfirmar(null)}
        titulo={t.confirmarPapelera}
        texto={t.papeleraAviso}
        confirmar={tp.enviarPapelera}
        alConfirmar={() => guardar('papelera')}
        ocupado={ocupado}
      />
    </>
  );
}
