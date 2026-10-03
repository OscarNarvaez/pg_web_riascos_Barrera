import { beforeAll, describe, expect, it } from 'vitest';
import { sanearHtml } from './sanear';

const BUCKET = 'https://proyecto.supabase.co/storage/v1/object/public/publicaciones';

beforeAll(() => {
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://proyecto.supabase.co';
});

describe('saneado del HTML de publicaciones (§13)', () => {
  it('elimina scripts y manejadores de eventos', () => {
    const html = sanearHtml(
      `<p onclick="x()">Hola</p><script>alert(1)</script><img src="${BUCKET}/2026/a-1600.webp" onerror="x()" alt="A">`,
    );
    expect(html).not.toMatch(/script|onclick|onerror/i);
    expect(html).toContain('<p>Hola</p>');
    expect(html).toContain('alt="A"');
  });

  it('elimina enlaces javascript:', () => {
    expect(sanearHtml('<a href="javascript:alert(1)">x</a>')).not.toMatch(/javascript:/i);
  });

  it('elimina estilos, iframes y atributos data', () => {
    const html = sanearHtml(
      '<p style="color:red" data-x="1">a</p><iframe src="https://x"></iframe>',
    );
    expect(html).toBe('<p>a</p>');
  });

  it('convierte h1 en h2: el título de la página es el único h1', () => {
    expect(sanearHtml('<h1>Uno</h1><h2>Dos</h2>')).toBe('<h2>Uno</h2><h2>Dos</h2>');
  });

  it('los enlaces a otra pestaña llevan rel seguro', () => {
    expect(sanearHtml('<a href="https://ejemplo.com" target="_blank">x</a>')).toContain(
      'rel="noopener noreferrer"',
    );
  });

  it('conserva el formato del editor', () => {
    const html =
      '<h2>T</h2><p><strong>a</strong> <em>b</em></p><ul><li>c</li></ul><blockquote><p>d</p></blockquote>';
    expect(sanearHtml(html)).toBe(html);
  });

  it('solo admite imágenes del bucket de publicaciones', () => {
    const propia = `<img src="${BUCKET}/2026/a-1600.webp" alt="Propia">`;
    expect(sanearHtml(propia)).toBe(propia);
    expect(sanearHtml('<p>a<img src="https://rastreo.invalid/p.gif" alt="x"></p>')).toBe(
      '<p>a</p>',
    );
    expect(sanearHtml('<img src="data:image/png;base64,AAAA" alt="x">')).toBe('');
  });
});
