import { describe, expect, it } from 'vitest';
import { cabecerasCors, igualesSeguro, tokenDe } from './_compartido/http.js';
import { codigoErrorInvitacion, validarInvitacion } from './invitar-usuario/logica.js';
import { EVENTO, esWebhookAutorizado, peticionDispatch } from './reconstruir-sitio/logica.js';

const SITIO = 'https://oscarnarvaez.github.io/pg_web_riascos_Barrera';

describe('cabecerasCors', () => {
  it('refleja el origen del sitio, sin la ruta base', () => {
    const c = cabecerasCors('https://oscarnarvaez.github.io', SITIO);
    expect(c['Access-Control-Allow-Origin']).toBe('https://oscarnarvaez.github.io');
  });

  it('admite el desarrollo local', () => {
    expect(cabecerasCors('http://localhost:3000', SITIO)['Access-Control-Allow-Origin']).toBe(
      'http://localhost:3000',
    );
  });

  it('no refleja otros orígenes', () => {
    expect(cabecerasCors('https://otro.invalid', SITIO)).not.toHaveProperty(
      'Access-Control-Allow-Origin',
    );
  });

  it('sin SITE_URL válida solo admite el desarrollo local', () => {
    expect(cabecerasCors('https://oscarnarvaez.github.io', '')).not.toHaveProperty(
      'Access-Control-Allow-Origin',
    );
  });
});

describe('tokenDe e igualesSeguro', () => {
  it('extrae el token Bearer', () => {
    expect(tokenDe('Bearer abc.def')).toBe('abc.def');
    expect(tokenDe(null)).toBe('');
  });

  it('compara secretos', () => {
    expect(igualesSeguro('secreto-largo', 'secreto-largo')).toBe(true);
    expect(igualesSeguro('secreto-largo', 'secreto-larga')).toBe(false);
    expect(igualesSeguro('secreto', 'secreto-largo')).toBe(false);
    expect(igualesSeguro('', '')).toBe(false);
  });
});

describe('validarInvitacion', () => {
  it('normaliza y acepta una invitación válida', () => {
    expect(
      validarInvitacion({ email: ' Nombre@Empresa.COM ', nombre: ' Ana ', rol: 'editor' }),
    ).toEqual({
      datos: { email: 'nombre@empresa.com', nombre: 'Ana', cargo: null, rol: 'editor' },
    });
  });

  it('devuelve un código por campo', () => {
    expect(validarInvitacion({ email: 'sin-arroba', nombre: '', rol: 'superusuario' })).toEqual({
      errores: { email: 'correo_invalido', nombre: 'obligatorio', rol: 'rol_invalido' },
    });
  });

  it('tolera un cuerpo vacío o inválido', () => {
    expect(validarInvitacion(null)).toHaveProperty('errores');
    expect(validarInvitacion('texto')).toHaveProperty('errores');
  });

  it('limita la longitud del nombre y del cargo', () => {
    const largo = 'x'.repeat(121);
    expect(
      validarInvitacion({ email: 'a@b.co', nombre: largo, cargo: largo, rol: 'admin' }).errores,
    ).toEqual({ nombre: 'demasiado_largo', cargo: 'demasiado_largo' });
  });
});

describe('codigoErrorInvitacion', () => {
  it.each([
    [{ code: 'email_exists' }, 'correo_existente'],
    [{ message: 'A user with this email address has already been registered' }, 'correo_existente'],
    [{ message: 'Email address not authorized' }, 'correo_no_autorizado'],
    [{ code: 'over_email_send_rate_limit' }, 'limite_de_correos'],
    [{ message: 'Otro error' }, 'invitacion_fallida'],
    [null, 'invitacion_fallida'],
  ])('%j → %s', (error, codigo) => {
    expect(codigoErrorInvitacion(error)).toBe(codigo);
  });
});

describe('reconstruir-sitio', () => {
  it('exige el secreto compartido del webhook', () => {
    expect(esWebhookAutorizado('s3creto', 's3creto')).toBe(true);
    expect(esWebhookAutorizado('otro', 's3creto')).toBe(false);
    expect(esWebhookAutorizado(null, 's3creto')).toBe(false);
  });

  it('sin secreto configurado, el webhook no autoriza nada', () => {
    expect(esWebhookAutorizado('', undefined)).toBe(false);
    expect(esWebhookAutorizado('cualquiera', '')).toBe(false);
  });

  it('dispara el evento que escucha el flujo de despliegue', () => {
    const { url, init } = peticionDispatch('tkn', 'panel');
    expect(url).toBe('https://api.github.com/repos/OscarNarvaez/pg_web_riascos_Barrera/dispatches');
    expect(init.headers.Authorization).toBe('Bearer tkn');
    expect(JSON.parse(init.body)).toEqual({
      event_type: EVENTO,
      client_payload: { origen: 'panel' },
    });
  });
});
