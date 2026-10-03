'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Boton from '@/components/ui/Boton';
import Campo from '@/components/ui/Campo';
import { rutasPanel } from '@/config/panel';
import { errores, ingreso, mensajeCampo, panel, restablecer as t } from '@/content/es/panel';
import { clientePanel } from '@/lib/panel/cliente';
import { codigoDeErrorAuth } from '@/lib/panel/errores';
import { registrarActividad } from '@/lib/panel/inactividad';
import { erroresDeContrasena, errorDeCorreo } from '@/lib/panel/validacion';
import { SITE_URL } from '@/lib/sitio';
import Aviso from '../ui/Aviso';
import { useSesion } from '../sesion/ProveedorSesion';

const TIPOS = ['invite', 'recovery'];
const sinSuscripcion = () => () => {};

/**
 * Recuperación de contraseña e invitaciones (§7.1). Atiende dos tipos de enlace:
 * - Con plantilla propia (?token_hash=…&type=…): el token se verifica solo al enviar la
 *   contraseña, para que los analizadores de enlaces del correo no lo consuman antes.
 * - Con la plantilla estándar de Supabase: la sesión llega en el fragmento de la URL y la
 *   recoge el cliente al cargar.
 * Sin enlace, ofrece pedir uno por correo.
 */
export default function Restablecer() {
  const parametros = useSearchParams();
  const { fase } = useSesion();
  const tokenHash = parametros.get('token_hash');
  const tipo = TIPOS.includes(parametros.get('type') ?? '') ? parametros.get('type') : null;
  // Un enlace estándar vencido trae el error en el fragmento (#error_code=otp_expired…).
  const fragmento = useSyncExternalStore(
    sinSuscripcion,
    () => window.location.hash,
    () => '',
  );
  const enlaceVencido = /error_code=|error=/.test(fragmento);

  const [errorGeneral, setErrorGeneral] = useState('');
  const [erroresCampos, setErroresCampos] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(/** @type {null | 'enviado' | 'listo'} */ (null));

  const definir = Boolean(tokenHash && tipo) || fase === 'con-sesion';
  const avisoError = errorGeneral || (enlaceVencido && !definir ? errores.enlace_vencido : '');

  /** @param {import('react').FormEvent<HTMLFormElement>} e */
  async function guardarContrasena(e) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const clave = String(datos.get('clave') ?? '');
    const encontrados = erroresDeContrasena(clave, String(datos.get('confirmacion') ?? ''));
    setErroresCampos(encontrados);
    setErrorGeneral('');
    if (Object.keys(encontrados).length) return;

    setEnviando(true);
    const cliente = clientePanel();
    if (tokenHash && tipo && fase !== 'con-sesion') {
      const { error } = await cliente.auth.verifyOtp({ token_hash: tokenHash, type: tipo });
      if (error) {
        setErrorGeneral(errores[codigoDeErrorAuth(error)] ?? errores.enlace_vencido);
        setEnviando(false);
        return;
      }
    }
    const { error } = await cliente.auth.updateUser({ password: clave });
    setEnviando(false);
    if (error) {
      const codigo = codigoDeErrorAuth(error);
      if (codigo === 'contrasena_debil') setErroresCampos({ clave: 'contrasena_debil' });
      else setErrorGeneral(errores[codigo] ?? errores.desconocido);
      return;
    }
    registrarActividad();
    setResultado('listo');
  }

  /** @param {import('react').FormEvent<HTMLFormElement>} e */
  async function pedirEnlace(e) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get('email') ?? '').trim();
    const errorCorreo = errorDeCorreo(email);
    setErroresCampos(errorCorreo ? { email: errorCorreo } : {});
    setErrorGeneral('');
    if (errorCorreo) return;

    setEnviando(true);
    const { error } = await clientePanel().auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}${rutasPanel.restablecer}`,
    });
    setEnviando(false);
    // Salvo fallos de conexión o de límite, la respuesta es la misma exista o no la cuenta:
    // así el formulario no revela qué correos tienen acceso al panel.
    const codigo = error ? codigoDeErrorAuth(error) : null;
    if (codigo === 'red' || codigo === 'demasiados_intentos') setErrorGeneral(errores[codigo]);
    else setResultado('enviado');
  }

  if (resultado === 'listo') {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="font-titulo text-titulo text-verde">{t.tituloDefinir}</h1>
        <Aviso tipo="exito">{t.listo}</Aviso>
        <Boton href={rutasPanel.tablero}>{t.irAlPanel}</Boton>
      </div>
    );
  }

  if (fase === 'cargando' && !tokenHash) {
    return (
      <p role="status" className="text-verde-gris">
        {panel.cargando}
      </p>
    );
  }

  if (definir) {
    return (
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h1 className="font-titulo text-titulo text-verde">{t.tituloDefinir}</h1>
          <p className="text-verde-gris">{t.textoDefinir}</p>
        </div>
        <form onSubmit={guardarContrasena} noValidate className="flex flex-col gap-2">
          <Campo
            etiqueta={t.nueva}
            nombre="clave"
            tipo="password"
            autoComplete="new-password"
            obligatorio
            error={mensajeCampo(erroresCampos.clave)}
          />
          <Campo
            etiqueta={t.confirmar}
            nombre="confirmacion"
            tipo="password"
            autoComplete="new-password"
            obligatorio
            error={mensajeCampo(erroresCampos.confirmacion)}
          />
          <Aviso tipo="error" className="mb-4">
            {errorGeneral}
          </Aviso>
          <Boton type="submit" disabled={enviando} anchoCompleto>
            {enviando ? panel.guardando : t.guardar}
          </Boton>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h1 className="font-titulo text-titulo text-verde">{t.tituloSolicitar}</h1>
        <p className="text-verde-gris">{t.textoSolicitar}</p>
      </div>
      {resultado === 'enviado' ? (
        <Aviso tipo="exito">{t.enviado}</Aviso>
      ) : (
        <form onSubmit={pedirEnlace} noValidate className="flex flex-col gap-2">
          <Aviso tipo="error" className="mb-4">
            {avisoError}
          </Aviso>
          <Campo
            etiqueta={ingreso.correo}
            nombre="email"
            tipo="email"
            autoComplete="username"
            obligatorio
            error={mensajeCampo(erroresCampos.email)}
          />
          <Boton type="submit" disabled={enviando} anchoCompleto>
            {enviando ? t.enviando : t.enviarEnlace}
          </Boton>
        </form>
      )}
      <Link
        href={rutasPanel.ingresar}
        className="flex min-h-11 items-center self-start text-verde underline underline-offset-4"
      >
        {t.volverIngreso}
      </Link>
    </div>
  );
}
