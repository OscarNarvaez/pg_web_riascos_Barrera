'use client';

import { useState } from 'react';
import Boton from '@/components/ui/Boton';
import Campo from '@/components/ui/Campo';
import { errores, mensajeCampo, panel, usuarios as t } from '@/content/es/panel';
import { useConsulta } from '@/hooks/useConsulta';
import { clientePanel, invocarFuncion } from '@/lib/panel/cliente';
import { codigoDeError } from '@/lib/panel/errores';
import { formatearFechaHora } from '@/lib/panel/fechas';
import { validarInvitacion } from '@/lib/panel/validacion';
import { useSesion } from '../sesion/ProveedorSesion';
import Aviso from '../ui/Aviso';
import Dialogo from '../ui/Dialogo';
import EncabezadoSeccion from '../ui/EncabezadoSeccion';

const VACIO = { id: null, email: '', nombre: '', cargo: '', rol: 'editor' };
const ROLES = [
  { valor: 'editor', etiqueta: panel.roles.editor },
  { valor: 'admin', etiqueta: panel.roles.admin },
];

/**
 * Usuarios del panel (§7.2, solo admin): listado, invitación mediante la Edge Function
 * invitar-usuario y edición de nombre, cargo y rol. La base impide quitar el último
 * administrador.
 */
export default function GestionUsuarios() {
  const { usuario, recargarPerfil } = useSesion();
  const { datos, error, cargando, recargar } = useConsulta(
    () => clientePanel().rpc('usuarios_del_panel'),
    [],
  );
  const [formulario, setFormulario] = useState(/** @type {typeof VACIO | null} */ (null));
  const [erroresCampos, setErroresCampos] = useState(/** @type {Record<string, string>} */ ({}));
  const [errorDialogo, setErrorDialogo] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState(
    /** @type {{ tipo: 'exito' | 'error', texto: string } | null} */ (null),
  );

  function abrir(u) {
    setErroresCampos({});
    setErrorDialogo('');
    setFormulario(
      u
        ? { id: u.id, email: u.email, nombre: u.full_name, cargo: u.job_title ?? '', rol: u.role }
        : VACIO,
    );
  }

  const cambiar = (cambios) => setFormulario((f) => ({ ...f, ...cambios }));

  /** Invita a una persona nueva, o reenvía la invitación a una cuenta pendiente. */
  async function invitar(datosInvitacion) {
    const { error: codigo, campos } = await invocarFuncion('invitar-usuario', {
      email: datosInvitacion.email.trim(),
      nombre: datosInvitacion.nombre.trim(),
      cargo: datosInvitacion.cargo.trim(),
      rol: datosInvitacion.rol,
    });
    return { codigo, campos };
  }

  /** @param {import('react').FormEvent<HTMLFormElement>} e */
  async function guardar(e) {
    e.preventDefault();
    const encontrados = validarInvitacion(formulario);
    if (formulario.id) delete encontrados.email;
    setErroresCampos(encontrados);
    setErrorDialogo('');
    if (Object.keys(encontrados).length) return;
    setOcupado(true);

    if (formulario.id) {
      const { error: fallo } = await clientePanel()
        .from('profiles')
        .update({
          full_name: formulario.nombre.trim(),
          job_title: formulario.cargo.trim() || null,
          role: formulario.rol,
        })
        .eq('id', formulario.id);
      setOcupado(false);
      if (fallo) {
        setErrorDialogo(errores[codigoDeError(fallo)] ?? errores.desconocido);
        return;
      }
      if (formulario.id === usuario?.id) recargarPerfil();
      setAviso({ tipo: 'exito', texto: panel.cambiosGuardados });
    } else {
      const { codigo, campos } = await invitar(formulario);
      setOcupado(false);
      if (codigo) {
        if (campos) setErroresCampos(campos);
        setErrorDialogo(errores[codigo] ?? errores.desconocido);
        return;
      }
      setAviso({ tipo: 'exito', texto: t.invitacionEnviada(formulario.email.trim()) });
    }
    setFormulario(null);
    recargar();
  }

  async function reenviar(u) {
    setAviso(null);
    const { codigo } = await invitar({
      email: u.email,
      nombre: u.full_name,
      cargo: u.job_title ?? '',
      rol: u.role,
    });
    setAviso(
      codigo
        ? { tipo: 'error', texto: errores[codigo] ?? errores.desconocido }
        : { tipo: 'exito', texto: t.invitacionEnviada(u.email) },
    );
  }

  return (
    <>
      <EncabezadoSeccion titulo={t.titulo}>
        <Boton tamano="compacto" onClick={() => abrir(null)}>
          {t.invitar}
        </Boton>
      </EncabezadoSeccion>

      {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
      <Aviso tipo="error">{error && errores[error]}</Aviso>
      {cargando && <p role="status">{panel.cargando}</p>}

      {(datos ?? []).length > 0 && (
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <thead className="border-b border-verde/20 text-pequeno text-verde-gris">
              <tr>
                <th scope="col" className="py-3 pr-4 font-medium">
                  {t.nombre}
                </th>
                <th scope="col" className="py-3 pr-4 font-medium">
                  {t.correo}
                </th>
                <th scope="col" className="py-3 pr-4 font-medium">
                  {t.rol}
                </th>
                <th scope="col" className="py-3 pr-4 font-medium">
                  {t.ultimoAcceso}
                </th>
                <th scope="col" className="py-3 font-medium">
                  <span className="sr-only">{panel.editar}</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-verde/10">
              {datos.map((u) => (
                <tr key={u.id}>
                  <td className="py-3 pr-4">
                    <span className="font-medium">{u.full_name || t.sinNombre}</span>
                    {u.id === usuario?.id && <span className="text-verde-gris"> {t.usted}</span>}
                    {u.job_title && (
                      <span className="block text-pequeno text-verde-gris">{u.job_title}</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 [overflow-wrap:anywhere]">{u.email}</td>
                  <td className="py-3 pr-4">{panel.roles[u.role]}</td>
                  <td className="py-3 pr-4 text-pequeno">
                    {u.confirmado
                      ? u.last_sign_in_at
                        ? formatearFechaHora(u.last_sign_in_at)
                        : t.nunca
                      : t.pendiente}
                  </td>
                  <td className="py-3">
                    <span className="flex flex-wrap gap-2">
                      <Boton
                        variante="contorno"
                        tamano="compacto"
                        onClick={() => abrir(u)}
                        aria-label={`${panel.editar}: ${u.full_name || u.email}`}
                      >
                        {panel.editar}
                      </Boton>
                      {!u.confirmado && (
                        <Boton variante="contorno" tamano="compacto" onClick={() => reenviar(u)}>
                          {t.reenviar}
                        </Boton>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialogo
        abierto={Boolean(formulario)}
        alCerrar={() => setFormulario(null)}
        titulo={formulario?.id ? t.tituloEditar : t.tituloInvitar}
      >
        {formulario && (
          <form onSubmit={guardar} noValidate className="flex flex-col gap-2">
            {formulario.id ? (
              <p className="mb-4 [overflow-wrap:anywhere]">
                {t.correo}: <span className="font-medium">{formulario.email}</span>
              </p>
            ) : (
              <Campo
                etiqueta={t.correo}
                nombre="email"
                tipo="email"
                value={formulario.email}
                onChange={(e) => cambiar({ email: e.target.value })}
                obligatorio
                error={mensajeCampo(erroresCampos.email)}
              />
            )}
            <Campo
              etiqueta={t.nombre}
              nombre="nombre"
              value={formulario.nombre}
              onChange={(e) => cambiar({ nombre: e.target.value })}
              obligatorio
              error={mensajeCampo(erroresCampos.nombre, 'nombre')}
            />
            <Campo
              etiqueta={t.cargo}
              nombre="cargo"
              value={formulario.cargo}
              onChange={(e) => cambiar({ cargo: e.target.value })}
              ayuda={t.cargoAyuda}
              error={mensajeCampo(erroresCampos.cargo, 'nombre')}
            />
            <Campo
              etiqueta={t.rol}
              nombre="rol"
              tipo="select"
              value={formulario.rol}
              onChange={(e) => cambiar({ rol: e.target.value })}
              opciones={ROLES}
              ayuda={t.rolAyuda}
              error={mensajeCampo(erroresCampos.rol)}
            />
            <Aviso tipo="error" className="mb-4">
              {errorDialogo}
            </Aviso>
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Boton variante="contorno" onClick={() => setFormulario(null)}>
                {panel.cancelar}
              </Boton>
              <Boton type="submit" disabled={ocupado}>
                {ocupado
                  ? formulario.id
                    ? panel.guardando
                    : t.enviando
                  : formulario.id
                    ? panel.guardar
                    : t.enviarInvitacion}
              </Boton>
            </div>
          </form>
        )}
      </Dialogo>
    </>
  );
}
