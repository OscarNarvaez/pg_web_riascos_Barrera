import { describe, expect, it } from 'vitest';
import { opacidadVidrio, paleta, tinteMosaico } from '@/config/paleta';
import { contraste, mezclar } from './contraste';

const { verde, verdeGris, oro, oliva, marfil } = paleta;
const AA_CUERPO = 4.5;
const AA_GRANDE = 3;

describe('contraste de la paleta (§9.3)', () => {
  it.each([
    ['verde sobre marfil', verde, marfil, 11.6],
    ['verde-gris sobre marfil', verdeGris, marfil, 4.8],
    ['oro sobre marfil', oro, marfil, 3.6],
    ['oro sobre verde', oro, verde, 3.2],
    ['marfil sobre verde', marfil, verde, 11.6],
    ['verde-gris sobre verde', verdeGris, verde, 2.4],
  ])('%s ≈ %s:1 como indica la especificación', (_, a, b, esperado) => {
    expect(contraste(a, b)).toBeCloseTo(esperado, 0);
  });

  it('el texto de cuerpo solo usa combinaciones AA', () => {
    expect(contraste(verde, marfil)).toBeGreaterThanOrEqual(AA_CUERPO);
    expect(contraste(verdeGris, marfil)).toBeGreaterThanOrEqual(AA_CUERPO);
    expect(contraste(marfil, verde)).toBeGreaterThanOrEqual(AA_CUERPO);
  });

  it('el oro solo alcanza para texto grande, íconos y foco', () => {
    expect(contraste(oro, marfil)).toBeGreaterThanOrEqual(AA_GRANDE);
    expect(contraste(oro, marfil)).toBeLessThan(AA_CUERPO);
    expect(contraste(oro, verde)).toBeGreaterThanOrEqual(AA_GRANDE);
  });

  it('nada es legible como cuerpo sobre oliva sólido', () => {
    for (const texto of [verde, marfil, verdeGris]) {
      expect(contraste(texto, oliva)).toBeLessThan(AA_CUERPO);
    }
  });

  it('el texto secundario sobre verde (marfil al 75 %) cumple AA', () => {
    expect(contraste(mezclar(marfil, verde, 0.75), verde)).toBeGreaterThanOrEqual(AA_CUERPO);
  });
});

describe('contraste del vidrio contra el peor fondo posible (§9.3)', () => {
  it('vidrio claro: texto verde con verde detrás', () => {
    const superficie = mezclar(marfil, verde, opacidadVidrio.claro);
    expect(contraste(verde, superficie)).toBeGreaterThanOrEqual(AA_CUERPO);
  });

  it('vidrio oscuro: texto marfil con marfil detrás', () => {
    const superficie = mezclar(verde, marfil, opacidadVidrio.oscuro);
    expect(contraste(marfil, superficie)).toBeGreaterThanOrEqual(AA_CUERPO);
  });
});

describe('contraste sobre superficies derivadas', () => {
  const mosaico = mezclar(oliva, marfil, tinteMosaico);

  it('en los mosaicos el texto va en verde: verde-gris no alcanza AA sobre el tinte', () => {
    expect(contraste(verde, mosaico)).toBeGreaterThanOrEqual(AA_CUERPO);
    expect(contraste(verdeGris, mosaico)).toBeLessThan(AA_CUERPO);
  });

  it('vidrio denso (menú y buscador): texto verde con verde detrás', () => {
    const superficie = mezclar(marfil, verde, opacidadVidrio.denso);
    expect(contraste(verde, superficie)).toBeGreaterThanOrEqual(AA_CUERPO);
  });
});
