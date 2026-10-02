/**
 * Inventario de pendientes (especificación §14.4 y §17).
 *
 *   pnpm pendientes              Lista en consola y actualiza docs/PENDIENTES_CLIENTE.md.
 *   node scripts/pendientes.mjs --solo-consola
 *                                Solo lista en consola (lo usa `pnpm dev`).
 *   node scripts/pendientes.mjs --verificar
 *                                Lista en consola y falla si una página obligatoria sigue
 *                                pendiente, salvo con PERMITIR_PENDIENTES=true.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { espaciosDeImagen } from '../src/config/imagenes.js';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIRECTORIOS = ['src/config', 'src/content', 'src/app', 'src/components'];
const EXTENSIONES = new Set(['.js', '.jsx', '.mjs', '.json', '.md']);
const MARCADOR = /\[PENDIENTE:\s*([^\]]+)\]/g;
const DOCUMENTO = path.join(RAIZ, 'docs/PENDIENTES_CLIENTE.md');
const INICIO_BLOQUE = '<!-- inicio:generado por pnpm pendientes -->';
const FIN_BLOQUE = '<!-- fin:generado -->';

/** Páginas que no pueden publicarse con contenido pendiente (§14.4). */
export const OBLIGATORIAS = [
  'src/content/legal/politica-privacidad.md',
  'src/content/legal/politica-tratamiento-datos.md',
];

/** @param {string} dir */
async function recorrer(dir) {
  if (!existsSync(dir)) return [];
  const entradas = await readdir(dir, { withFileTypes: true, recursive: true });
  return entradas
    .filter((e) => e.isFile() && EXTENSIONES.has(path.extname(e.name)))
    .map((e) => path.join(e.parentPath, e.name))
    .filter((f) => !/\.test\.[jm]?jsx?$/.test(f));
}

export async function inventariar() {
  /** @type {{ archivo: string, linea: number, descripcion: string }[]} */
  const marcadores = [];
  for (const dir of DIRECTORIOS) {
    for (const archivo of await recorrer(path.join(RAIZ, dir))) {
      const lineas = (await readFile(archivo, 'utf8')).split('\n');
      lineas.forEach((texto, i) => {
        for (const m of texto.matchAll(MARCADOR)) {
          marcadores.push({
            archivo: path.relative(RAIZ, archivo),
            linea: i + 1,
            descripcion: m[1].trim(),
          });
        }
      });
    }
  }

  let disponibles = {};
  try {
    disponibles = JSON.parse(
      await readFile(path.join(RAIZ, 'src/data/imagenes.generated.json'), 'utf8'),
    );
  } catch {
    // Sin manifiesto, todas las imágenes cuentan como faltantes.
  }
  const imagenesFaltantes = Object.entries(espaciosDeImagen)
    .filter(([nombre]) => !disponibles[nombre])
    .map(([nombre, e]) => ({ nombre, ...e }));

  const obligatorias = OBLIGATORIAS.filter(
    (f) => !existsSync(path.join(RAIZ, f)) || marcadores.some((m) => m.archivo === f),
  );

  return { marcadores, imagenesFaltantes, obligatorias };
}

/** @param {Awaited<ReturnType<typeof inventariar>>} inv */
function aMarkdown(inv) {
  const filas = inv.marcadores
    .map((m) => `| ${m.descripcion} | \`${m.archivo}:${m.linea}\` |`)
    .join('\n');
  const imagenes = inv.imagenesFaltantes
    .map(
      (i) =>
        `| \`${i.nombre}\` | ${i.proporcion.join(':')} | ${i.minimo.join(' × ')} | ${i.ubicacion} |`,
    )
    .join('\n');
  return [
    INICIO_BLOQUE,
    '',
    `### Marcadores en el código (${inv.marcadores.length})`,
    '',
    inv.marcadores.length ? `| Falta | Dónde |\n|---|---|\n${filas}` : 'Ninguno.',
    '',
    `### Imágenes faltantes (${inv.imagenesFaltantes.length} de ${Object.keys(espaciosDeImagen).length})`,
    '',
    inv.imagenesFaltantes.length
      ? `| Archivo | Proporción | Mínimo | Dónde aparece |\n|---|---|---|---|\n${imagenes}`
      : 'Ninguna.',
    '',
    FIN_BLOQUE,
  ].join('\n');
}

async function actualizarDocumento(inv) {
  const actual = await readFile(DOCUMENTO, 'utf8');
  const bloque = aMarkdown(inv);
  const inicio = actual.indexOf(INICIO_BLOQUE);
  const fin = actual.indexOf(FIN_BLOQUE);
  const nuevo =
    inicio >= 0 && fin > inicio
      ? actual.slice(0, inicio) + bloque + actual.slice(fin + FIN_BLOQUE.length)
      : `${actual.trimEnd()}\n\n## Inventario generado\n\n${bloque}\n`;
  await writeFile(DOCUMENTO, nuevo);
}

/** @param {Awaited<ReturnType<typeof inventariar>>} inv */
function informar(inv) {
  console.log(
    `Pendientes: ${inv.marcadores.length} marcadores, ` +
      `${inv.imagenesFaltantes.length} imágenes faltantes, ` +
      `${inv.obligatorias.length} páginas obligatorias pendientes.`,
  );
  for (const m of inv.marcadores) console.log(`  · ${m.descripcion}  (${m.archivo}:${m.linea})`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const verificar = process.argv.includes('--verificar');
  const soloConsola = process.argv.includes('--solo-consola');
  const inv = await inventariar();
  informar(inv);

  if (soloConsola) {
    // Usado por `pnpm dev`: informa sin tocar el documento.
  } else if (!verificar) {
    await actualizarDocumento(inv);
    console.log('docs/PENDIENTES_CLIENTE.md actualizado.');
  } else if (inv.obligatorias.length > 0) {
    if (process.env.PERMITIR_PENDIENTES === 'true') {
      console.warn(
        `Aviso: ${inv.obligatorias.length} páginas obligatorias siguen pendientes ` +
          '(se permite porque PERMITIR_PENDIENTES=true).',
      );
    } else {
      console.error(
        'La compilación de producción no puede continuar. Páginas obligatorias pendientes:',
      );
      for (const f of inv.obligatorias) console.error(`  · ${f}`);
      console.error('Para una vista previa, compile con PERMITIR_PENDIENTES=true.');
      process.exit(1);
    }
  }
}
