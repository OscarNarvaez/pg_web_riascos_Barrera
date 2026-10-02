/**
 * Lectura de las políticas legales en Markdown (especificación §5.8). Solo en compilación.
 * Cada archivo lleva en su encabezado el título, la versión y la fecha de vigencia; la versión
 * se registra con cada consentimiento (§8.3).
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { marked } from 'marked';
import { esPendiente } from './pendientes';

/** @typedef {{ titulo: string, version: string, vigencia: string, cuerpo: string, html: string | null }} Politica */

/**
 * Separa el encabezado (pares clave: valor entre líneas ---) del cuerpo.
 * @param {string} fuente
 */
export function separarEncabezado(fuente) {
  const m = fuente.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { datos: {}, cuerpo: fuente.trim() };
  const datos = Object.fromEntries(
    m[1]
      .split('\n')
      .map((linea) => linea.match(/^(\w+):\s*(.*)$/))
      .filter(Boolean)
      .map(([, clave, valor]) => [clave, valor.replace(/^"(.*)"$/, '$1').trim()]),
  );
  return { datos, cuerpo: m[2].trim() };
}

/**
 * @param {'politica-privacidad' | 'politica-tratamiento-datos'} nombre
 * @returns {Promise<Politica>}
 */
export async function leerPolitica(nombre) {
  const fuente = await readFile(
    path.join(process.cwd(), 'src/content/legal', `${nombre}.md`),
    'utf8',
  );
  const { datos, cuerpo } = separarEncabezado(fuente);
  return {
    titulo: datos.titulo ?? '',
    version: datos.version ?? '',
    vigencia: datos.vigencia ?? '',
    cuerpo,
    // Un cuerpo que es solo un marcador no se convierte: lo muestra <Pendiente>.
    html: esPendiente(cuerpo) ? null : await marked.parse(cuerpo),
  };
}
