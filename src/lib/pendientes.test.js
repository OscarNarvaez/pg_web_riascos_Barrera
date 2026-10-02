import { describe, expect, it } from 'vitest';
import { descripcionPendiente, esPendiente, formatearPendiente } from './pendientes';

describe('marcadores de pendientes', () => {
  it('reconoce el formato exacto y extrae la descripción', () => {
    const valor = formatearPendiente('teléfono institucional');
    expect(esPendiente(valor)).toBe(true);
    expect(descripcionPendiente(valor)).toBe('teléfono institucional');
  });

  it('no confunde datos confirmados con marcadores', () => {
    expect(esPendiente('Edificio Hito, Oficina 1103')).toBe(false);
    expect(esPendiente(undefined)).toBe(false);
    expect(descripcionPendiente('Pasto')).toBeNull();
  });
});
