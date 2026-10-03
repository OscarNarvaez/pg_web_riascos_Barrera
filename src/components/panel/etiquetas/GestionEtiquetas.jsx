'use client';

import { useState } from 'react';
import Boton from '@/components/ui/Boton';
import Campo from '@/components/ui/Campo';
import Casilla from '@/components/ui/Casilla';
import { errores, etiquetas as t, mensajeCampo, panel } from '@/content/es/panel';
import { useConsulta } from '@/hooks/useConsulta';
import { clientePanel } from '@/lib/panel/cliente';
import { codigoDeError } from '@/lib/panel/errores';
import { generarSlug } from '@/lib/panel/texto';
import { validarEtiqueta } from '@/lib/panel/validacion';
import { SITE_URL } from '@/lib/sitio';
import ActualizarSitio from '../ActualizarSitio';
import { avisoRecompilando } from '../guardado';
import Aviso from '../ui/Aviso';
import Confirmacion from '../ui/Confirmacion';
import Dialogo from '../ui/Dialogo';
import EncabezadoSeccion from '../ui/EncabezadoSeccion';

const VACIA = { id: null, nombre: '', slug: '', slugManual: false, descripcion: '' };

/** Usos de una etiqueta: publicaciones y lecturas que la llevan (incluidos borradores). */
const usosDe = (e) => ({
  publicaciones: e.post_tags?.[0]?.count ?? 0,
  lecturas: e.external_read_tags?.[0]?.count ?? 0,
});

/**
 * Etiquetas (§7.2): crear, editar y eliminar. Eliminar una etiqueta en uso exige confirmarlo
 * de forma explícita. Si la etiqueta está en uso, el cambio se refleja en el sitio.
 */
export default function GestionEtiquetas() {
  const { datos, error, cargando, recargar } = useConsulta(
    () =>
      clientePanel()
        .from('tags')
        .select('id, name, slug, description, post_tags(count), external_read_tags(count)')
        .order('name'),
    [],
  );
  const [formulario, setFormulario] = useState(/** @type {typeof VACIA | null} */ (null));
  const [erroresCampos, setErroresCampos] = useState(/** @type {Record<string, string>} */ ({}));
  const [errorDialogo, setErrorDialogo] = useState('');
  const [eliminar, setEliminar] = useState(/** @type {any} */ (null));
  const [entiendo, setEntiendo] = useState(false);
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState(
    /** @type {import('../guardado').AvisoGuardado | null} */ (null),
  );

  function abrir(e) {
    setErroresCampos({});
    setErrorDialogo('');
    setFormulario(
      e
        ? {
            id: e.id,
            nombre: e.name,
            slug: e.slug,
            slugManual: true,
            descripcion: e.description ?? '',
          }
        : VACIA,
    );
  }

  function cambiar(cambios) {
    setFormulario((f) => {
      const nuevo = { ...f, ...cambios };
      if ('nombre' in cambios && !f.slugManual) nuevo.slug = generarSlug(cambios.nombre);
      return nuevo;
    });
  }

  /** @param {import('react').FormEvent<HTMLFormElement>} ev */
  async function guardar(ev) {
    ev.preventDefault();
    const encontrados = validarEtiqueta(formulario);
    setErroresCampos(encontrados);
    if (Object.keys(encontrados).length) return;
    setOcupado(true);
    const datosFila = {
      name: formulario.nombre.trim(),
      slug: formulario.slug,
      description: formulario.descripcion.trim() || null,
    };
    const cliente = clientePanel();
    const { error: fallo } = formulario.id
      ? await cliente.from('tags').update(datosFila).eq('id', formulario.id)
      : await cliente.from('tags').insert(datosFila);
    if (fallo) {
      const codigo = codigoDeError(fallo);
      if (codigo === 'slug_duplicado') setErroresCampos({ slug: codigo });
      else setErrorDialogo(errores[codigo] ?? errores.desconocido);
      setOcupado(false);
      return;
    }
    const anterior = (datos ?? []).find((e) => e.id === formulario.id);
    const enUso = anterior && usosDe(anterior).publicaciones + usosDe(anterior).lecturas > 0;
    setFormulario(null);
    setOcupado(false);
    setAviso(enUso ? await avisoRecompilando() : { tipo: 'exito', texto: panel.cambiosGuardados });
    recargar();
  }

  async function confirmarEliminar() {
    setOcupado(true);
    const { error: fallo } = await clientePanel().from('tags').delete().eq('id', eliminar.id);
    const u = usosDe(eliminar);
    setOcupado(false);
    setEliminar(null);
    setEntiendo(false);
    if (fallo)
      setAviso({ tipo: 'error', texto: errores[codigoDeError(fallo)] ?? errores.desconocido });
    else if (u.publicaciones + u.lecturas > 0) setAviso(await avisoRecompilando());
    else setAviso({ tipo: 'exito', texto: panel.cambiosGuardados });
    recargar();
  }

  const usosEliminar = eliminar ? usosDe(eliminar) : null;
  const totalEliminar = usosEliminar ? usosEliminar.publicaciones + usosEliminar.lecturas : 0;

  return (
    <>
      <EncabezadoSeccion titulo={t.titulo}>
        <Boton tamano="compacto" onClick={() => abrir(null)}>
          {t.nueva}
        </Boton>
      </EncabezadoSeccion>

      {aviso && (
        <div className="flex flex-col items-start gap-3">
          <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>
          {aviso.actualizar && <ActualizarSitio compacto />}
        </div>
      )}
      <Aviso tipo="error">{error && errores[error]}</Aviso>
      {cargando && <p role="status">{panel.cargando}</p>}
      {!cargando && !error && (datos ?? []).length === 0 && (
        <p className="text-verde-gris">{t.vacia}</p>
      )}

      {(datos ?? []).length > 0 && (
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {datos.map((e) => {
            const u = usosDe(e);
            return (
              <li key={e.id} className="flex flex-col gap-3 rounded-mosaico bg-oliva/15 p-5">
                <div className="flex flex-col gap-1">
                  <h2 className="text-subtitulo font-medium [overflow-wrap:anywhere]">{e.name}</h2>
                  <p className="text-pequeno [overflow-wrap:anywhere] text-verde-gris">{e.slug}</p>
                </div>
                {e.description && <p className="text-pequeno">{e.description}</p>}
                <p className="text-pequeno">{t.usos(u.publicaciones, u.lecturas)}</p>
                <div className="mt-auto flex gap-2">
                  <Boton
                    variante="contorno"
                    tamano="compacto"
                    onClick={() => abrir(e)}
                    aria-label={`${panel.editar}: ${e.name}`}
                  >
                    {panel.editar}
                  </Boton>
                  <Boton
                    variante="contorno"
                    tamano="compacto"
                    onClick={() => setEliminar(e)}
                    aria-label={`${panel.eliminar}: ${e.name}`}
                  >
                    {panel.eliminar}
                  </Boton>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <Dialogo
        abierto={Boolean(formulario)}
        alCerrar={() => setFormulario(null)}
        titulo={formulario?.id ? t.tituloEditar : t.tituloNueva}
      >
        {formulario && (
          <form onSubmit={guardar} noValidate className="flex flex-col gap-2">
            <Campo
              etiqueta={t.nombre}
              nombre="nombre"
              value={formulario.nombre}
              onChange={(e) => cambiar({ nombre: e.target.value })}
              obligatorio
              error={mensajeCampo(erroresCampos.nombre)}
            />
            <Campo
              etiqueta={t.slug}
              nombre="slug"
              value={formulario.slug}
              onChange={(e) => cambiar({ slug: e.target.value.toLowerCase(), slugManual: true })}
              obligatorio
              ayuda={t.slugAyuda(`${SITE_URL}/publicaciones/etiqueta/${formulario.slug || '…'}/`)}
              error={mensajeCampo(erroresCampos.slug)}
            />
            <Campo
              etiqueta={t.descripcion}
              nombre="descripcion"
              tipo="textarea"
              rows={3}
              value={formulario.descripcion}
              onChange={(e) => cambiar({ descripcion: e.target.value })}
              ayuda={t.descripcionAyuda}
            />
            <Aviso tipo="error" className="mb-4">
              {errorDialogo}
            </Aviso>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Boton variante="contorno" onClick={() => setFormulario(null)}>
                {panel.cancelar}
              </Boton>
              <Boton type="submit" disabled={ocupado}>
                {ocupado ? panel.guardando : panel.guardar}
              </Boton>
            </div>
          </form>
        )}
      </Dialogo>

      <Confirmacion
        abierto={Boolean(eliminar)}
        alCerrar={() => {
          setEliminar(null);
          setEntiendo(false);
        }}
        titulo={eliminar ? t.confirmarEliminar(eliminar.name) : ''}
        texto={totalEliminar > 0 ? t.enUso(totalEliminar) : t.sinUso}
        confirmar={panel.eliminar}
        alConfirmar={confirmarEliminar}
        ocupado={ocupado}
        deshabilitado={totalEliminar > 0 && !entiendo}
      >
        {totalEliminar > 0 && (
          <Casilla
            nombre="entiendo"
            checked={entiendo}
            onChange={(e) => setEntiendo(e.target.checked)}
          >
            {t.entiendo}
          </Casilla>
        )}
      </Confirmacion>
    </>
  );
}
