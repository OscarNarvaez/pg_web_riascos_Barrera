'use client';

import { useState } from 'react';
import Boton from '@/components/ui/Boton';
import Campo from '@/components/ui/Campo';
import Casilla from '@/components/ui/Casilla';
import { errores, mensajeCampo, panel, referentes as t } from '@/content/es/panel';
import { useConsulta } from '@/hooks/useConsulta';
import { clientePanel } from '@/lib/panel/cliente';
import { codigoDeError } from '@/lib/panel/errores';
import { normalizarCodigo } from '@/lib/panel/texto';
import { validarReferente } from '@/lib/panel/validacion';
import { SITE_URL } from '@/lib/sitio';
import Aviso from '../ui/Aviso';
import BotonCopiar from '../ui/BotonCopiar';
import Confirmacion from '../ui/Confirmacion';
import Dialogo from '../ui/Dialogo';
import EncabezadoSeccion from '../ui/EncabezadoSeccion';

const VACIO = { id: null, nombre: '', codigo: '', activo: true, notas: '' };

/**
 * Enlace de un referente (§7.2 y §8.4). Usa la URL vigente del sitio: al activar el dominio
 * propio en la Fase 7, los enlaces pasan a https://riascosbarrera.com/?ref=CODIGO.
 * @param {string} codigo
 */
export function enlaceReferente(codigo) {
  return `${SITE_URL}/?ref=${encodeURIComponent(codigo)}`;
}

async function cargar() {
  const cliente = clientePanel();
  const [referentes, contactos] = await Promise.all([
    cliente.from('referral_partners').select('*').order('name'),
    cliente.from('leads').select('referral_code').not('referral_code', 'is', null),
  ]);
  const error = referentes.error ?? contactos.error;
  if (error) return { data: null, error };
  const conteo = new Map();
  for (const c of contactos.data ?? [])
    conteo.set(c.referral_code, (conteo.get(c.referral_code) ?? 0) + 1);
  return {
    data: (referentes.data ?? []).map((r) => ({ ...r, contactos: conteo.get(r.code) ?? 0 })),
    error: null,
  };
}

/** Referentes (§7.2, solo admin): código, enlace para compartir y contactos atribuidos. */
export default function GestionReferentes() {
  const { datos, error, cargando, recargar } = useConsulta(cargar, []);
  const [formulario, setFormulario] = useState(/** @type {typeof VACIO | null} */ (null));
  const [erroresCampos, setErroresCampos] = useState(/** @type {Record<string, string>} */ ({}));
  const [errorDialogo, setErrorDialogo] = useState('');
  const [eliminar, setEliminar] = useState(/** @type {any} */ (null));
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState(
    /** @type {{ tipo: 'exito' | 'error', texto: string } | null} */ (null),
  );

  function abrir(r) {
    setErroresCampos({});
    setErrorDialogo('');
    setFormulario(
      r
        ? { id: r.id, nombre: r.name, codigo: r.code, activo: r.active, notas: r.notes ?? '' }
        : VACIO,
    );
  }

  const cambiar = (cambios) => setFormulario((f) => ({ ...f, ...cambios }));

  /** @param {import('react').FormEvent<HTMLFormElement>} e */
  async function guardar(e) {
    e.preventDefault();
    const encontrados = validarReferente(formulario);
    setErroresCampos(encontrados);
    if (Object.keys(encontrados).length) return;
    setOcupado(true);
    const fila = {
      name: formulario.nombre.trim(),
      code: formulario.codigo,
      active: formulario.activo,
      notes: formulario.notas.trim() || null,
    };
    const cliente = clientePanel();
    const { error: fallo } = formulario.id
      ? await cliente.from('referral_partners').update(fila).eq('id', formulario.id)
      : await cliente.from('referral_partners').insert(fila);
    setOcupado(false);
    if (fallo) {
      const codigo = codigoDeError(fallo);
      if (codigo === 'codigo_duplicado') setErroresCampos({ codigo });
      else setErrorDialogo(errores[codigo] ?? errores.desconocido);
      return;
    }
    setFormulario(null);
    setAviso({ tipo: 'exito', texto: panel.cambiosGuardados });
    recargar();
  }

  async function confirmarEliminar() {
    setOcupado(true);
    const { error: fallo } = await clientePanel()
      .from('referral_partners')
      .delete()
      .eq('id', eliminar.id);
    setOcupado(false);
    setEliminar(null);
    setAviso(
      fallo
        ? { tipo: 'error', texto: errores[codigoDeError(fallo)] ?? errores.desconocido }
        : { tipo: 'exito', texto: panel.cambiosGuardados },
    );
    recargar();
  }

  return (
    <>
      <EncabezadoSeccion titulo={t.titulo}>
        <Boton tamano="compacto" onClick={() => abrir(null)}>
          {t.nuevo}
        </Boton>
      </EncabezadoSeccion>

      {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
      <Aviso tipo="error">{error && errores[error]}</Aviso>
      {cargando && <p role="status">{panel.cargando}</p>}
      {!cargando && !error && (datos ?? []).length === 0 && (
        <p className="text-verde-gris">{t.vacia}</p>
      )}

      {(datos ?? []).length > 0 && (
        <ul className="grid gap-4 lg:grid-cols-2">
          {datos.map((r) => {
            const enlace = enlaceReferente(r.code);
            return (
              <li key={r.id} className="flex flex-col gap-4 rounded-mosaico bg-oliva/15 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <h2 className="text-subtitulo font-medium [overflow-wrap:anywhere]">
                      {r.name}
                    </h2>
                    <p className="text-pequeno">
                      {t.codigo}: <span className="font-medium">{r.code}</span>
                      {!r.active && ` · ${t.inactivo}`}
                    </p>
                  </div>
                  <p className="font-medium">{t.contactos(r.contactos)}</p>
                </div>
                {r.notes && <p className="text-pequeno">{r.notes}</p>}
                <div className="flex flex-col gap-2">
                  <p className="text-pequeno text-verde-gris">{t.enlace}</p>
                  <code className="rounded-control bg-marfil px-3 py-2 text-pequeno [overflow-wrap:anywhere]">
                    {enlace}
                  </code>
                  <BotonCopiar texto={enlace} etiqueta={t.copiarEnlace(r.name)} />
                </div>
                <div className="mt-auto flex gap-2">
                  <Boton
                    variante="contorno"
                    tamano="compacto"
                    onClick={() => abrir(r)}
                    aria-label={`${panel.editar}: ${r.name}`}
                  >
                    {panel.editar}
                  </Boton>
                  <Boton
                    variante="contorno"
                    tamano="compacto"
                    onClick={() => setEliminar(r)}
                    aria-label={`${panel.eliminar}: ${r.name}`}
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
        titulo={formulario?.id ? t.tituloEditar : t.tituloNuevo}
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
              etiqueta={t.codigo}
              nombre="codigo"
              value={formulario.codigo}
              onChange={(e) => cambiar({ codigo: normalizarCodigo(e.target.value) })}
              obligatorio
              ayuda={`${t.codigoAyuda} ${enlaceReferente(formulario.codigo || 'CODIGO')}`}
              error={mensajeCampo(erroresCampos.codigo)}
            />
            <Casilla
              nombre="activo"
              checked={formulario.activo}
              onChange={(e) => cambiar({ activo: e.target.checked })}
            >
              {t.activo}
              <span className="block text-pequeno text-verde-gris">{t.activoAyuda}</span>
            </Casilla>
            <Campo
              etiqueta={t.notas}
              nombre="notas"
              tipo="textarea"
              rows={3}
              value={formulario.notas}
              onChange={(e) => cambiar({ notas: e.target.value })}
              ayuda={t.notasAyuda}
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
        alCerrar={() => setEliminar(null)}
        titulo={eliminar ? t.confirmarEliminar(eliminar.name) : ''}
        texto={t.eliminarAviso}
        confirmar={panel.eliminar}
        alConfirmar={confirmarEliminar}
        ocupado={ocupado}
      />
    </>
  );
}
