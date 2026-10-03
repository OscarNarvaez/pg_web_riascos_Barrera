import { describe, expect, it } from 'vitest';
import { aCsv, celda } from './csv';
import { codigoDeError, codigoDeErrorAuth } from './errores';
import { afectaAlSitio, estadoDe } from './estado';
import { aEntradaBogota, deEntradaBogota, limiteDelDia } from './fechas';
import { errorDeArchivo, medidasDestino, nombreBase, TAMANO_MAXIMO } from './imagenes';
import { contarPor, haceDias } from './tablero';
import {
  errorDeSlug,
  generarSlug,
  MAX_SLUG,
  minutosDeLectura,
  normalizarCodigo,
  sinParrafosVaciosFinales,
} from './texto';
import {
  errorDeUrl,
  erroresDeContrasena,
  imagenesSinTextoAlternativo,
  validarLectura,
  validarPublicacion,
  validarReferente,
} from './validacion';

describe('slugs y códigos', () => {
  it('genera el mismo slug que public.generar_slug()', () => {
    expect(generarSlug('Contratación estatal: ¿Año?')).toBe('contratacion-estatal-ano');
    expect(generarSlug('  SECOP II — guía  ')).toBe('secop-ii-guia');
    expect(generarSlug('')).toBe('');
  });

  it('acorta los slugs largos sin cortar una palabra', () => {
    const slug = generarSlug('palabra '.repeat(20));
    expect(slug.length).toBeLessThanOrEqual(MAX_SLUG);
    expect(slug).toMatch(/^palabra(-palabra)*$/);
  });

  it('valida el formato y los slugs reservados del listado', () => {
    expect(errorDeSlug('')).toBe('obligatorio');
    expect(errorDeSlug('Con Mayúsculas')).toBe('slug_invalido');
    expect(errorDeSlug('doble--guion')).toBe('slug_invalido');
    expect(errorDeSlug('casos', { reservados: true })).toBe('slug_reservado');
    expect(errorDeSlug('casos')).toBeNull();
    expect(errorDeSlug('contratacion-estatal', { reservados: true })).toBeNull();
  });

  it('quita los párrafos vacíos que el editor deja al final', () => {
    expect(sinParrafosVaciosFinales('<h2>T</h2><p></p><p><br></p>')).toBe('<h2>T</h2>');
    expect(sinParrafosVaciosFinales('<p>a</p><p></p><p>b</p>')).toBe('<p>a</p><p></p><p>b</p>');
  });

  it('normaliza el código de un referente', () => {
    expect(normalizarCodigo('Peña Ríos 2026')).toBe('PENARIOS2026');
  });

  it('calcula los minutos de lectura como la compilación', () => {
    expect(minutosDeLectura('')).toBe(1);
    expect(minutosDeLectura('palabra '.repeat(500))).toBe(3);
  });
});

describe('fechas en hora de Bogotá', () => {
  it('convierte a y desde el campo datetime-local', () => {
    expect(aEntradaBogota('2026-10-03T13:00:00.000Z')).toBe('2026-10-03T08:00');
    expect(deEntradaBogota('2026-10-03T08:00')).toBe('2026-10-03T13:00:00.000Z');
    expect(deEntradaBogota('')).toBeNull();
    expect(aEntradaBogota(null)).toBe('');
  });

  it('delimita un día completo de Bogotá', () => {
    expect(limiteDelDia('2026-10-01')).toBe('2026-10-01T05:00:00.000Z');
    expect(limiteDelDia('2026-10-01', { fin: true })).toBe('2026-10-02T04:59:59.999Z');
    expect(limiteDelDia('ayer')).toBeNull();
  });
});

describe('estado de una publicación', () => {
  const ahora = new Date('2026-10-02T12:00:00Z');
  const base = { status: 'publicado', published_at: '2026-10-01T00:00:00Z', deleted_at: null };

  it('distingue borrador, programada, publicada y papelera', () => {
    expect(estadoDe({ ...base, status: 'borrador' }, ahora)).toBe('borrador');
    expect(estadoDe({ ...base, published_at: '2026-10-05T00:00:00Z' }, ahora)).toBe('programada');
    expect(estadoDe(base, ahora)).toBe('publicada');
    expect(estadoDe({ ...base, deleted_at: '2026-10-02T00:00:00Z' }, ahora)).toBe('papelera');
  });

  it('solo pide recompilar si el cambio toca lo visible', () => {
    const borrador = { ...base, status: 'borrador' };
    expect(afectaAlSitio(null, borrador, ahora)).toBe(false);
    expect(afectaAlSitio(borrador, base, ahora)).toBe(true);
    expect(afectaAlSitio(base, borrador, ahora)).toBe(true);
    expect(afectaAlSitio(borrador, { ...base, published_at: '2026-10-09T00:00:00Z' }, ahora)).toBe(
      false,
    );
  });
});

describe('CSV', () => {
  it('escapa separadores, comillas y saltos de línea', () => {
    expect(celda('a;b')).toBe('"a;b"');
    expect(celda('dijo "hola"')).toBe('"dijo ""hola"""');
    expect(celda('línea\nnueva')).toBe('"línea\nnueva"');
    expect(celda(null)).toBe('');
  });

  it('neutraliza fórmulas al abrir el archivo en una hoja de cálculo', () => {
    expect(celda('=HYPERLINK("x")')).toBe(`"'=HYPERLINK(""x"")"`);
    expect(celda('+57 300')).toBe("'+57 300");
    expect(celda('@SUMA')).toBe("'@SUMA");
  });

  it('empieza con BOM y separa con punto y coma', () => {
    const csv = aCsv(
      [{ n: 'Ana', c: 'a@b.co' }],
      [
        { titulo: 'Nombre', valor: (f) => f.n },
        { titulo: 'Correo', valor: (f) => f.c },
      ],
    );
    expect(csv).toBe('﻿Nombre;Correo\r\nAna;a@b.co');
  });
});

describe('imágenes', () => {
  it('valida tipo y tamaño (§7.3)', () => {
    expect(errorDeArchivo(null)).toBe('obligatorio');
    expect(errorDeArchivo({ type: 'image/gif', size: 10 })).toBe('tipo_no_admitido');
    expect(errorDeArchivo({ type: 'image/png', size: TAMANO_MAXIMO + 1 })).toBe('archivo_grande');
    expect(errorDeArchivo({ type: 'image/jpeg', size: 1000 })).toBeNull();
  });

  it('reduce sin ampliar y conserva la proporción', () => {
    expect(medidasDestino(4000, 3000, 1600)).toEqual({ ancho: 1600, alto: 1200 });
    expect(medidasDestino(1200, 900, 1600)).toEqual({ ancho: 1200, alto: 900 });
  });

  it('nombra las imágenes por año con un identificador único', () => {
    expect(nombreBase(new Date('2026-10-02T00:00:00Z'))).toMatch(/^2026\/[0-9a-f-]{36}$/);
  });
});

describe('errores', () => {
  it('traduce los errores de la base a códigos del panel', () => {
    expect(codigoDeError({ code: '23505', message: 'duplicate key "posts_slug_key"' })).toBe(
      'slug_duplicado',
    );
    expect(codigoDeError({ code: '23505', hint: 'slug_anterior_de_otra', message: 'x' })).toBe(
      'slug_redirige_a_otra',
    );
    expect(
      codigoDeError({ code: '23505', message: 'duplicate key "referral_partners_code_key"' }),
    ).toBe('codigo_duplicado');
    expect(codigoDeError({ code: '23514', message: 'violates "caso_publicado_anonimizado"' })).toBe(
      'caso_sin_anonimizar',
    );
    expect(codigoDeError({ code: '23514', hint: 'ultimo_admin', message: 'x' })).toBe(
      'ultimo_admin',
    );
    expect(codigoDeError({ code: '42501', message: 'x' })).toBe('sin_permiso');
    expect(codigoDeError({ code: '22P02', message: 'invalid input syntax for type uuid' })).toBe(
      'no_encontrado',
    );
    expect(codigoDeError({ name: 'TypeError', message: 'Failed to fetch' })).toBe('red');
    expect(codigoDeError(null)).toBeNull();
  });

  it('traduce los errores de Auth', () => {
    expect(codigoDeErrorAuth({ code: 'invalid_credentials' })).toBe('credenciales');
    expect(codigoDeErrorAuth({ code: 'weak_password', message: '' })).toBe('contrasena_debil');
    expect(codigoDeErrorAuth({ code: 'otp_expired', message: '' })).toBe('enlace_vencido');
    expect(codigoDeErrorAuth({ status: 429, code: 'over_request_rate_limit' })).toBe(
      'demasiados_intentos',
    );
  });
});

describe('validación', () => {
  const publicacion = {
    tipo: 'articulo',
    titulo: 'Título',
    slug: 'titulo',
    extracto: '',
    portada: null,
    portadaAlt: '',
    html: '<p>Texto</p>',
    texto: 'Texto',
    anonimizado: false,
    fecha: null,
  };

  it('acepta una publicación completa', () => {
    expect(validarPublicacion(publicacion, { publicar: true })).toEqual({});
  });

  it('exige texto alternativo en la portada y en las imágenes del cuerpo', () => {
    expect(validarPublicacion({ ...publicacion, portada: 'x.webp' })).toEqual({
      portadaAlt: 'alt_obligatorio',
    });
    expect(imagenesSinTextoAlternativo('<img src="a" alt=" "><img src="b" alt="Bien">')).toBe(1);
    expect(validarPublicacion({ ...publicacion, html: '<img src="a">' })).toEqual({
      cuerpo: 'imagen_sin_alt',
    });
  });

  it('un caso solo se publica anonimizado; un borrador sí puede guardarse', () => {
    const caso = { ...publicacion, tipo: 'caso' };
    expect(validarPublicacion(caso, { publicar: true })).toEqual({
      anonimizado: 'caso_sin_anonimizar',
    });
    expect(validarPublicacion(caso)).toEqual({});
  });

  it('publicar exige cuerpo y un slug no reservado', () => {
    expect(
      validarPublicacion(
        { ...publicacion, slug: 'pagina', html: '', texto: '' },
        { publicar: true },
      ),
    ).toEqual({ slug: 'slug_reservado', cuerpo: 'cuerpo_vacio' });
  });

  it('valida las lecturas y sus enlaces', () => {
    expect(errorDeUrl('https://www.ejemplo.com/a')).toBeNull();
    expect(errorDeUrl('javascript:alert(1)')).toBe('url_invalida');
    expect(errorDeUrl('www.ejemplo.com')).toBe('url_invalida');
    expect(
      validarLectura({ titulo: '', fuente: 'F', url: 'ftp://x.co', comentario: 'x'.repeat(501) }),
    ).toEqual({ titulo: 'obligatorio', url: 'url_invalida', comentario: 'demasiado_largo' });
  });

  it('valida los referentes', () => {
    expect(validarReferente({ nombre: 'A', codigo: 'ALIADO1' })).toEqual({});
    expect(validarReferente({ nombre: '', codigo: 'con espacio' })).toEqual({
      nombre: 'obligatorio',
      codigo: 'codigo_invalido',
    });
  });

  it('exige contraseñas robustas e iguales', () => {
    expect(erroresDeContrasena('corta', 'corta')).toEqual({ clave: 'contrasena_corta' });
    expect(erroresDeContrasena('solominusculas123', 'x')).toEqual({ clave: 'contrasena_debil' });
    expect(erroresDeContrasena('Robusta-2026-panel', 'otra')).toEqual({
      confirmacion: 'contrasenas_distintas',
    });
    expect(erroresDeContrasena('Robusta-2026-panel', 'Robusta-2026-panel')).toEqual({});
  });
});

describe('tablero', () => {
  it('cuenta por valor, agrupa los vacíos y ordena de mayor a menor', () => {
    const filas = [{ o: 'google' }, { o: 'otro' }, { o: 'google' }, { o: '' }, { o: null }];
    expect(contarPor(filas, (f) => f.o)).toEqual([
      { valor: 'google', total: 2 },
      { valor: null, total: 2 },
      { valor: 'otro', total: 1 },
    ]);
  });

  it('calcula el inicio del periodo', () => {
    expect(haceDias(30, new Date('2026-10-31T00:00:00Z'))).toBe('2026-10-01T00:00:00.000Z');
  });
});
