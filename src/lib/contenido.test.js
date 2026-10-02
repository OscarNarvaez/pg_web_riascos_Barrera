import { describe, expect, it, vi } from 'vitest';
import { paginar, relacionadas } from './contenido';

const pub = (id, fecha, ...etiquetas) => ({
  id,
  fecha,
  etiquetas: etiquetas.map((slug) => ({ slug, name: slug, id: slug })),
});

describe('paginación (§5.5)', () => {
  it('9 por página y al menos una página aunque no haya nada', () => {
    expect(paginar([]).total).toBe(1);
    const p = paginar(Array.from({ length: 19 }, (_, i) => i));
    expect(p.total).toBe(3);
    expect(p.pagina(3)).toEqual([18]);
  });
});

describe('publicaciones relacionadas (§5.5)', () => {
  const actual = pub('a', '2026-01-05', 'secop', 'criterio');
  const todas = [
    actual,
    pub('b', '2026-01-01', 'secop'),
    pub('c', '2026-01-04', 'secop', 'criterio'),
    pub('d', '2026-01-03', 'laboral'),
    pub('e', '2026-01-02', 'criterio'),
    pub('f', '2026-01-06', 'secop'),
  ];

  it('hasta 3, por etiquetas compartidas y luego por fecha, sin la propia', () => {
    expect(relacionadas(actual, todas).map((p) => p.id)).toEqual(['c', 'f', 'e']);
  });

  it('sin etiquetas no hay relacionadas', () => {
    expect(relacionadas(pub('x', '2026-01-01'), todas)).toEqual([]);
  });
});

describe('contenido de prueba (regla 2)', () => {
  it('se niega a funcionar en CI: nunca puede llegar a un despliegue', async () => {
    vi.resetModules();
    vi.stubEnv('CONTENIDO_DE_PRUEBA', '1');
    vi.stubEnv('CI', 'true');
    const { obtenerContenido } = await import('./contenido');
    await expect(obtenerContenido()).rejects.toThrow(/CI/);
    vi.unstubAllEnvs();
  });

  it('en local produce publicaciones con la forma esperada', async () => {
    vi.resetModules();
    vi.stubEnv('CONTENIDO_DE_PRUEBA', '1');
    vi.stubEnv('CI', '');
    const { obtenerContenido } = await import('./contenido');
    const { publicaciones, etiquetas } = await obtenerContenido();
    expect(publicaciones).toHaveLength(11);
    expect(publicaciones.find((p) => p.tipo === 'caso')).toBeTruthy();
    expect(etiquetas.map((e) => e.slug)).toEqual([
      'criterio',
      'cumplimiento-normativo',
      'normativa',
      'secop',
    ]);
    vi.unstubAllEnvs();
  });
});
