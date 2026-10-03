'use client';

import { useEffect, useId, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ArticuloPublicacion from '@/components/publicaciones/ArticuloPublicacion';
import Boton from '@/components/ui/Boton';
import Campo from '@/components/ui/Campo';
import Casilla from '@/components/ui/Casilla';
import EnlaceSecundario from '@/components/ui/EnlaceSecundario';
import { firma } from '@/config/firma';
import { rutasPanel } from '@/config/panel';
import { VARIANTES_PORTADA } from '@/config/publicaciones';
import { areasDeInteres } from '@/content/es/captacion';
import { errores, mensajeCampo, panel, publicaciones as t } from '@/content/es/panel';
import { clientePanel } from '@/lib/panel/cliente';
import { codigoDeError } from '@/lib/panel/errores';
import { estadoDe } from '@/lib/panel/estado';
import { aEntradaBogota, deEntradaBogota, formatearFechaHora } from '@/lib/panel/fechas';
import { generarSlug, minutosDeLectura, sinParrafosVaciosFinales } from '@/lib/panel/texto';
import { LIMITES, validarPublicacion } from '@/lib/panel/validacion';
import { sanearHtml } from '@/lib/sanear';
import { SITE_URL } from '@/lib/sitio';
import { urlPublica } from '@/lib/supabase';
import ActualizarSitio from '../ActualizarSitio';
import { avisoTrasGuardar, sincronizarEtiquetas } from '../guardado';
import { useSesion } from '../sesion/ProveedorSesion';
import Aviso from '../ui/Aviso';
import Confirmacion from '../ui/Confirmacion';
import Dialogo from '../ui/Dialogo';
import EncabezadoSeccion from '../ui/EncabezadoSeccion';
import Insignia from '../ui/Insignia';
import Pestanas from '../ui/Pestanas';
import SelectorEtiquetas from '../ui/SelectorEtiquetas';
import CampoPortada from './CampoPortada';
import EditorTexto from './EditorTexto';
import VistaGoogle from './VistaGoogle';

/** Las cuatro áreas de práctica, sin "No estoy seguro" (que solo existe en los formularios). */
const AREAS = areasDeInteres.filter((a) => a.valor !== 'no-seguro');

const VACIA = {
  tipo: 'articulo',
  titulo: '',
  slug: '',
  slugManual: false,
  extracto: '',
  portada: /** @type {string | null} */ (null),
  portadaAlt: '',
  area: '',
  etiquetas: /** @type {string[]} */ ([]),
  html: '',
  texto: '',
  anonimizado: false,
  fecha: '',
  metaTitulo: '',
  metaDescripcion: '',
};

/** Fila de la base → formulario. */
function aFormulario(fila) {
  return {
    tipo: fila.type,
    titulo: fila.title,
    slug: fila.slug,
    slugManual: true,
    extracto: fila.excerpt ?? '',
    portada: fila.cover_path,
    portadaAlt: fila.cover_alt ?? '',
    area: fila.practice_area ?? '',
    etiquetas: (fila.post_tags ?? []).map((r) => r.tag_id),
    html: fila.body_html ?? '',
    texto: fila.body_text ?? '',
    anonimizado: fila.is_anonymized,
    fecha: aEntradaBogota(fila.published_at),
    metaTitulo: fila.meta_title ?? '',
    metaDescripcion: fila.meta_description ?? '',
  };
}

/**
 * Crear y editar una publicación (§7.2): contenido, portada, etiquetas, SEO, vista previa con el
 * mismo componente del sitio, publicar, programar, despublicar y enviar a la papelera.
 */
export default function EditorPublicacion() {
  const router = useRouter();
  const id = useSearchParams().get('id');
  const { perfil } = useSesion();
  const idCuerpo = useId();

  const [carga, setCarga] = useState(
    /** @type {'cargando' | 'lista' | 'no-existe' | 'error'} */ ('cargando'),
  );
  const [f, setF] = useState(VACIA);
  const [fila, setFila] = useState(/** @type {any} */ (null));
  const [todasEtiquetas, setTodasEtiquetas] = useState([]);
  const [erroresCampos, setErroresCampos] = useState(/** @type {Record<string, string>} */ ({}));
  const [aviso, setAviso] = useState(
    /** @type {import('../guardado').AvisoGuardado | null} */ (null),
  );
  const [ocupado, setOcupado] = useState(false);
  const [sucio, setSucio] = useState(false);
  const [confirmar, setConfirmar] = useState(
    /** @type {null | 'despublicar' | 'papelera'} */ (null),
  );
  const [vistaPrevia, setVistaPrevia] = useState(false);

  // Carga la publicación (si hay ?id=) y la lista de etiquetas.
  useEffect(() => {
    let vigente = true;
    const cliente = clientePanel();
    Promise.all([
      cliente.from('tags').select('id, name, slug').order('name'),
      id
        ? cliente.from('posts').select('*, post_tags(tag_id)').eq('id', id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    ]).then(([etiquetas, publicacion]) => {
      if (!vigente) return;
      if (etiquetas.error || publicacion.error) {
        setCarga('error');
        return;
      }
      setTodasEtiquetas(etiquetas.data ?? []);
      if (id && !publicacion.data) {
        setCarga('no-existe');
        return;
      }
      if (publicacion.data) {
        setFila(publicacion.data);
        setF(aFormulario(publicacion.data));
      }
      setCarga('lista');
    });
    return () => {
      vigente = false;
    };
  }, [id]);

  // Aviso del navegador al salir con cambios sin guardar.
  useEffect(() => {
    if (!sucio) return undefined;
    const alSalir = (e) => e.preventDefault();
    window.addEventListener('beforeunload', alSalir);
    return () => window.removeEventListener('beforeunload', alSalir);
  }, [sucio]);

  /** @param {Partial<typeof VACIA>} cambios */
  function cambiar(cambios) {
    setF((actual) => {
      const nuevo = { ...actual, ...cambios };
      // El slug sigue al título hasta que alguien lo edita a mano.
      if ('titulo' in cambios && !actual.slugManual) nuevo.slug = generarSlug(cambios.titulo);
      return nuevo;
    });
    setSucio(true);
    setAviso(null);
  }

  const fechaIso = f.fecha ? deEntradaBogota(f.fecha) : null;
  const futura = fechaIso !== null && new Date(fechaIso) > new Date();
  const estado = fila ? estadoDe(fila) : 'borrador';

  /** @param {'guardar' | 'publicar' | 'despublicar' | 'papelera'} accion */
  async function guardar(accion) {
    const publicar = accion === 'publicar';
    const encontrados = validarPublicacion(
      { ...f, fechaInvalida: Boolean(f.fecha) && !fechaIso },
      { publicar: publicar || (accion === 'guardar' && fila?.status === 'publicado') },
    );
    setErroresCampos(encontrados);
    if (Object.keys(encontrados).length) {
      setAviso({ tipo: 'error', texto: panel.revisarCampos });
      return;
    }

    setOcupado(true);
    setAviso(null);
    const cliente = clientePanel();
    const ahora = new Date().toISOString();
    /** @type {Record<string, any>} */
    const datos = {
      type: f.tipo,
      title: f.titulo.trim(),
      slug: f.slug,
      excerpt: f.extracto.trim() || null,
      body_html: sinParrafosVaciosFinales(sanearHtml(f.html)),
      body_text: f.texto,
      cover_path: f.portada,
      cover_alt: f.portada ? f.portadaAlt.trim() : null,
      practice_area: f.area || null,
      is_anonymized: f.tipo === 'caso' && f.anonimizado,
      meta_title: f.metaTitulo.trim() || null,
      meta_description: f.metaDescripcion.trim() || null,
      reading_minutes: minutosDeLectura(f.texto),
    };
    if (publicar) {
      datos.status = 'publicado';
      datos.published_at = fechaIso ?? ahora;
    } else if (accion === 'despublicar') {
      datos.status = 'borrador';
    } else if (accion === 'papelera') {
      datos.deleted_at = ahora;
    } else {
      datos.published_at = fechaIso ?? (fila?.status === 'publicado' ? fila.published_at : null);
    }

    const consulta = fila
      ? cliente.from('posts').update(datos).eq('id', fila.id)
      : cliente.from('posts').insert(datos);
    const { data: guardada, error } = await consulta.select('*, post_tags(tag_id)').single();

    if (error) {
      const codigo = codigoDeError(error);
      if (['slug_duplicado', 'slug_redirige_a_otra', 'slug_reservado'].includes(codigo)) {
        setErroresCampos({ slug: codigo });
      } else if (codigo === 'caso_sin_anonimizar') {
        setErroresCampos({ anonimizado: codigo });
      }
      setAviso({ tipo: 'error', texto: errores[codigo] ?? errores.desconocido });
      setOcupado(false);
      return;
    }

    try {
      await sincronizarEtiquetas(
        cliente,
        'post_tags',
        'post_id',
        guardada.id,
        (fila?.post_tags ?? []).map((r) => r.tag_id),
        f.etiquetas,
      );
    } catch (fallo) {
      setAviso({ tipo: 'error', texto: errores[codigoDeError(fallo)] ?? errores.desconocido });
      setOcupado(false);
      return;
    }

    const actualizada = { ...guardada, post_tags: f.etiquetas.map((tag_id) => ({ tag_id })) };
    const nuevoAviso = await avisoTrasGuardar(fila, actualizada, { esPublicacion: true });
    setFila(actualizada);
    setF((actual) => ({
      ...actual,
      slug: guardada.slug,
      fecha: aEntradaBogota(guardada.published_at),
    }));
    setSucio(false);
    setOcupado(false);
    setConfirmar(null);

    if (accion === 'papelera') {
      router.push(rutasPanel.publicaciones);
      return;
    }
    setAviso(nuevoAviso);
    if (!fila) router.replace(`${rutasPanel.editarPublicacion}?id=${guardada.id}`);
  }

  if (carga === 'cargando') return <p role="status">{panel.cargando}</p>;
  if (carga !== 'lista') {
    return (
      <>
        <EncabezadoSeccion titulo={t.tituloEditar} />
        <Aviso tipo="error">{carga === 'no-existe' ? t.noExiste : errores.red}</Aviso>
        <EnlaceSecundario href={rutasPanel.publicaciones}>{t.volver}</EnlaceSecundario>
      </>
    );
  }

  const urlPublicacion = `${SITE_URL}/publicaciones/${f.slug || '…'}/`;
  const etiquetasElegidas = todasEtiquetas.filter((e) => f.etiquetas.includes(e.id));
  const enPapelera = estado === 'papelera';

  const previa = {
    id: fila?.id ?? 'nueva',
    tipo: f.tipo,
    titulo: f.titulo || t.campoTitulo,
    slug: f.slug,
    extracto: f.extracto,
    html: sanearHtml(f.html),
    portada: f.portada
      ? {
          grande: urlPublica(f.portada),
          mediana: urlPublica(
            f.portada.replace(VARIANTES_PORTADA.grande, VARIANTES_PORTADA.mediana),
          ),
          alt: f.portadaAlt,
        }
      : null,
    autor: perfil?.full_name || null,
    fecha: fechaIso ?? fila?.published_at ?? new Date().toISOString(),
    minutos: minutosDeLectura(f.texto),
    etiquetas: etiquetasElegidas,
  };

  const contenido = (
    <>
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-2 font-medium text-verde">{t.tipo}</legend>
        <div className="flex flex-wrap gap-6">
          {[
            ['articulo', t.articulo],
            ['caso', t.caso],
          ].map(([valor, etiqueta]) => (
            <label key={valor} className="inline-flex min-h-11 cursor-pointer items-center gap-3">
              <input
                type="radio"
                name="tipo"
                value={valor}
                checked={f.tipo === valor}
                onChange={() => cambiar({ tipo: valor })}
                className="size-5 accent-verde"
              />
              {etiqueta}
            </label>
          ))}
        </div>
      </fieldset>

      <Campo
        etiqueta={t.campoTitulo}
        nombre="titulo"
        value={f.titulo}
        onChange={(e) => cambiar({ titulo: e.target.value })}
        obligatorio
        maxLength={LIMITES.titulo}
        error={mensajeCampo(erroresCampos.titulo, 'titulo')}
      />
      <Campo
        etiqueta={t.slug}
        nombre="slug"
        value={f.slug}
        onChange={(e) => cambiar({ slug: e.target.value.toLowerCase(), slugManual: true })}
        obligatorio
        ayuda={`${t.slugAyuda(urlPublicacion)} ${fila ? t.slugCambio : ''}`}
        error={mensajeCampo(erroresCampos.slug)}
      />
      <Campo
        etiqueta={t.extracto}
        nombre="extracto"
        tipo="textarea"
        rows={3}
        value={f.extracto}
        onChange={(e) => cambiar({ extracto: e.target.value })}
        ayuda={`${t.extractoAyuda} ${panel.contador(f.extracto.length, LIMITES.extracto)}`}
        error={mensajeCampo(erroresCampos.extracto, 'extracto')}
      />
      <CampoPortada
        ruta={f.portada}
        alt={f.portadaAlt}
        errorAlt={mensajeCampo(erroresCampos.portadaAlt)}
        alCambiarRuta={(portada) => cambiar({ portada })}
        alCambiarAlt={(portadaAlt) => cambiar({ portadaAlt })}
      />
      <Campo
        etiqueta={t.area}
        nombre="area"
        tipo="select"
        value={f.area}
        onChange={(e) => cambiar({ area: e.target.value })}
        opciones={[{ valor: '', etiqueta: t.sinArea }, ...AREAS]}
      />
      <SelectorEtiquetas
        etiquetas={todasEtiquetas}
        seleccion={f.etiquetas}
        alCambiar={(etiquetas) => cambiar({ etiquetas })}
      />

      <div className="flex flex-col gap-2">
        <span id={idCuerpo} className="font-medium text-verde">
          {t.cuerpo}
        </span>
        <EditorTexto
          valorInicial={f.html}
          alCambiar={({ html, texto }) => cambiar({ html, texto })}
          idEtiqueta={idCuerpo}
          error={erroresCampos.cuerpo}
        />
        <p
          id={`${idCuerpo}-error`}
          aria-live="polite"
          className="min-h-[1lh] text-pequeno font-medium"
        >
          {mensajeCampo(erroresCampos.cuerpo)}
        </p>
      </div>

      {f.tipo === 'caso' && (
        <Casilla
          nombre="anonimizado"
          checked={f.anonimizado}
          onChange={(e) => cambiar({ anonimizado: e.target.checked })}
          error={mensajeCampo(erroresCampos.anonimizado)}
        >
          {t.anonimizado}
        </Casilla>
      )}
    </>
  );

  const seo = (
    <>
      <Campo
        etiqueta={t.metaTitulo}
        nombre="metaTitulo"
        value={f.metaTitulo}
        onChange={(e) => cambiar({ metaTitulo: e.target.value })}
        ayuda={`${t.metaTituloAyuda} ${panel.contador(f.metaTitulo.length, LIMITES.metaTitulo)}${
          f.metaTitulo.length > LIMITES.metaTitulo ? ` ${t.excede}` : ''
        }`}
      />
      <Campo
        etiqueta={t.metaDescripcion}
        nombre="metaDescripcion"
        tipo="textarea"
        rows={3}
        value={f.metaDescripcion}
        onChange={(e) => cambiar({ metaDescripcion: e.target.value })}
        ayuda={`${t.metaDescripcionAyuda} ${panel.contador(f.metaDescripcion.length, LIMITES.metaDescripcion)}${
          f.metaDescripcion.length > LIMITES.metaDescripcion ? ` ${t.excede}` : ''
        }`}
      />
      <VistaGoogle
        titulo={`${f.metaTitulo || f.titulo || t.campoTitulo} | ${firma.nombre}`}
        url={urlPublicacion}
        descripcion={f.metaDescripcion || f.extracto}
      />
    </>
  );

  return (
    <>
      <EncabezadoSeccion
        titulo={fila ? t.tituloEditar : t.tituloNueva}
        antes={<EnlaceSecundario href={rutasPanel.publicaciones}>{t.volver}</EnlaceSecundario>}
      >
        {fila && <Insignia estado={estado} />}
      </EncabezadoSeccion>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <Pestanas
          etiqueta={t.pestanas}
          pestanas={[
            { id: 'contenido', titulo: t.pestanaContenido, contenido },
            { id: 'seo', titulo: t.pestanaSeo, contenido: seo },
          ]}
        />

        <aside
          aria-label={t.publicacion}
          className="flex flex-col gap-5 self-start rounded-mosaico bg-oliva/15 p-5 xl:sticky xl:top-8"
        >
          <h2 className="font-titulo text-subtitulo">{t.publicacion}</h2>
          <p className="text-pequeno">
            {estado === 'publicada'
              ? t.publicadaEl(formatearFechaHora(fila.published_at))
              : estado === 'programada'
                ? t.programadaPara(formatearFechaHora(fila.published_at))
                : t.esBorrador}
          </p>
          <Campo
            etiqueta={t.fechaCampo}
            nombre="fecha"
            tipo="datetime-local"
            value={f.fecha}
            onChange={(e) => cambiar({ fecha: e.target.value })}
            ayuda={t.fechaAyuda}
            error={mensajeCampo(erroresCampos.fecha)}
          />
          <div className="flex flex-col gap-3">
            {!enPapelera && fila?.status !== 'publicado' && (
              <Boton onClick={() => guardar('publicar')} disabled={ocupado} anchoCompleto>
                {futura ? t.programar : t.publicar}
              </Boton>
            )}
            <Boton
              variante={fila?.status === 'publicado' ? 'principal' : 'contorno'}
              onClick={() => guardar('guardar')}
              disabled={ocupado}
              anchoCompleto
            >
              {ocupado
                ? panel.guardando
                : fila?.status === 'publicado'
                  ? t.guardar
                  : t.guardarBorrador}
            </Boton>
            <Boton variante="contorno" onClick={() => setVistaPrevia(true)} anchoCompleto>
              {t.vistaPrevia}
            </Boton>
            {fila?.status === 'publicado' && !enPapelera && (
              <Boton
                variante="contorno"
                onClick={() => setConfirmar('despublicar')}
                disabled={ocupado}
                anchoCompleto
              >
                {t.despublicar}
              </Boton>
            )}
            {fila && !enPapelera && (
              <Boton
                variante="contorno"
                onClick={() => setConfirmar('papelera')}
                disabled={ocupado}
                anchoCompleto
              >
                {t.enviarPapelera}
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
        confirmar={t.despublicar}
        alConfirmar={() => guardar('despublicar')}
        ocupado={ocupado}
      />
      <Confirmacion
        abierto={confirmar === 'papelera'}
        alCerrar={() => setConfirmar(null)}
        titulo={t.confirmarPapelera}
        texto={t.papeleraAviso}
        confirmar={t.enviarPapelera}
        alConfirmar={() => guardar('papelera')}
        ocupado={ocupado}
      />

      <Dialogo
        abierto={vistaPrevia}
        alCerrar={() => setVistaPrevia(false)}
        titulo={t.vistaPreviaAviso}
        ancho="completo"
      >
        <div className="-mx-6 sm:-mx-8">
          <ArticuloPublicacion publicacion={previa} url={urlPublicacion} />
        </div>
      </Dialogo>
    </>
  );
}
