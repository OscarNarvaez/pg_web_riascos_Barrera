import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { areas } from './areas';
import { inicio } from './inicio';

// Regla 1 (§2): el texto institucional sale del Anexo A, sin redactar nada nuevo.
const especificacion = readFileSync(path.join(process.cwd(), 'docs/ESPECIFICACION.md'), 'utf8')
  .replace(/\*+/g, '')
  .replace(/\s+/g, ' ');

/** Todas las cadenas de un objeto, salvo identificadores técnicos. */
function cadenas(valor, clave = '') {
  if (typeof valor === 'string')
    return ['ancla', 'imagen', 'numero'].includes(clave) ? [] : [valor];
  if (Array.isArray(valor)) return valor.flatMap((v) => cadenas(v, clave));
  if (valor && typeof valor === 'object') {
    return Object.entries(valor).flatMap(([k, v]) => cadenas(v, k));
  }
  return [];
}

describe('los textos institucionales salen literalmente del Anexo A', () => {
  it.each(cadenas({ inicio, areas }))('«%s»', (texto) => {
    expect(especificacion).toContain(texto);
  });
});
