import { describe, expect, it } from 'vitest';
import { destinoDe, trozosDeFragmento } from './busqueda';

describe('fragmentos de búsqueda (§5.6)', () => {
  it('separa coincidencias y texto', () => {
    expect(trozosDeFragmento('sobre la [[licitación]] pública')).toEqual([
      { texto: 'sobre la ', marcado: false },
      { texto: 'licitación', marcado: true },
      { texto: ' pública', marcado: false },
    ]);
  });

  it('no interpreta HTML: el texto queda como texto', () => {
    const trozos = trozosDeFragmento('<img src=x onerror=alert(1)> [[a]]');
    expect(trozos[0]).toEqual({ texto: '<img src=x onerror=alert(1)> ', marcado: false });
  });

  it('varias coincidencias y fragmento vacío', () => {
    expect(
      trozosDeFragmento('[[a]] y [[b]]')
        .filter((t) => t.marcado)
        .map((t) => t.texto),
    ).toEqual(['a', 'b']);
    expect(trozosDeFragmento('')).toEqual([]);
  });

  it('las lecturas enlazan afuera; las publicaciones, a su página', () => {
    expect(destinoDe({ tipo: 'lectura', url: 'https://x.org' })).toBe('https://x.org');
    expect(destinoDe({ tipo: 'caso', slug: 'abc' })).toBe('/publicaciones/abc/');
  });
});
