import { describe, expect, it } from 'vitest';
import { slugDeRuta } from './RespaldoPublicacion';

describe('respaldo de publicaciones nuevas en 404 (§3.5)', () => {
  it('reconoce /publicaciones/{slug}/ con y sin barra final', () => {
    expect(slugDeRuta('/publicaciones/reforma-secop/')).toBe('reforma-secop');
    expect(slugDeRuta('/publicaciones/reforma-secop')).toBe('reforma-secop');
  });

  it('ignora rutas reservadas, anidadas o ajenas', () => {
    expect(slugDeRuta('/publicaciones/casos/')).toBeNull();
    expect(slugDeRuta('/publicaciones/etiqueta/secop/')).toBeNull();
    expect(slugDeRuta('/la-firma/')).toBeNull();
    expect(slugDeRuta('/publicaciones/<script>/')).toBeNull();
  });
});
