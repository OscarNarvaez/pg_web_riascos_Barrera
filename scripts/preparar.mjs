/**
 * Preparación previa a `next dev` y `next build`.
 *
 * 1. Copia los logotipos oficiales de logos/ a public/logos/ sin modificarlos (regla 10).
 * 2. Genera src/fonts/fuentes.generated.js: IBM Plex Sans y, si están sus archivos, Breve (§9.4).
 * 3. Optimiza las imágenes del Anexo B (§11).
 * 4. Lista los pendientes; con --produccion, falla si una página obligatoria sigue pendiente,
 *    salvo con PERMITIR_PENDIENTES=true (§14.4).
 */
import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { optimizarImagenes } from './optimizar-imagenes.mjs';

const RAIZ = path.resolve(import.meta.dirname, '..');
const produccion = process.argv.includes('--produccion');

async function copiarLogos() {
  const destino = path.join(RAIZ, 'public/logos');
  await mkdir(destino, { recursive: true });
  for (const archivo of await readdir(path.join(RAIZ, 'logos'))) {
    await copyFile(path.join(RAIZ, 'logos', archivo), path.join(destino, archivo));
  }
}

const PLEX = [
  ['400', 'normal'],
  ['400', 'italic'],
  ['500', 'normal'],
  ['600', 'normal'],
].map(([weight, style]) => ({
  path: `./ibm-plex-sans/ibm-plex-sans-latin-${weight}-${style}.woff2`,
  weight,
  style,
}));

/**
 * Serializa las fuentes como literal de JavaScript con claves sin comillas: el cargador de
 * next/font rechaza las claves entre comillas.
 * @param {{ path: string, weight: string, style: string }[]} fuentes
 */
function literalDeFuentes(fuentes) {
  const filas = fuentes.map(
    (f) => `    { path: '${f.path}', weight: '${f.weight}', style: '${f.style}' },`,
  );
  return `[\n${filas.join('\n')}\n  ]`;
}

const PESOS = [
  [/thin|hairline/i, '100'],
  [/extra-?light|ultra-?light/i, '200'],
  [/light/i, '300'],
  [/semi-?bold|demi-?bold/i, '600'],
  [/extra-?bold|ultra-?bold/i, '800'],
  [/bold/i, '700'],
  [/black|heavy/i, '900'],
  [/medium/i, '500'],
];

/** @param {string} nombre */
function pesoDe(nombre) {
  return PESOS.find(([re]) => re.test(nombre))?.[1] ?? '400';
}

/**
 * Los archivos de Breve no están en el repositorio: el flujo de despliegue los descarga del
 * repositorio privado a src/fonts/breve/. Se identifican por el nombre del archivo.
 */
async function generarModuloFuentes() {
  const dir = path.join(RAIZ, 'src/fonts/breve');
  const archivos = existsSync(dir)
    ? (await readdir(dir)).filter((f) => f.endsWith('.woff2')).sort()
    : [];

  const familia = (re) =>
    archivos
      .filter((f) => re.test(f))
      .map((f) => ({
        path: `./breve/${f}`,
        weight: pesoDe(f),
        style: /italic/i.test(f) ? 'italic' : 'normal',
      }));

  const titulo = familia(/sans.*title|title/i);
  const news = familia(/news/i);

  const declarar = (nombre, variable, fuentes, respaldo, precargar) =>
    fuentes.length
      ? `export const ${nombre} = localFont({\n  src: ${literalDeFuentes(fuentes)},\n` +
        `  variable: '${variable}',\n  display: 'swap',\n  preload: ${precargar},\n` +
        `  fallback: [${respaldo.map((r) => `'${r}'`).join(', ')}],\n});\n`
      : `export const ${nombre} = { variable: '', className: '' };\n`;

  // next/font exige literales: la precarga de Plex se decide aquí. Si no hay Breve Sans Title,
  // Plex pasa a ser la tipografía principal y se precarga (§9.4).
  const plex =
    'export const plex = localFont({\n' +
    `  src: ${literalDeFuentes(PLEX)},\n` +
    "  variable: '--font-plex',\n  display: 'swap',\n" +
    `  preload: ${titulo.length === 0},\n` +
    "  fallback: ['system-ui', 'sans-serif'],\n});\n";

  const contenido =
    '// Archivo generado por scripts/preparar.mjs. No editar.\n' +
    "import localFont from 'next/font/local';\n\n" +
    plex +
    '\n' +
    declarar(
      'breveTitle',
      '--font-breve-title',
      titulo,
      ['IBM Plex Sans', 'system-ui', 'sans-serif'],
      true,
    ) +
    '\n' +
    declarar(
      'breveNews',
      '--font-breve-news',
      news,
      ['Georgia', 'Times New Roman', 'serif'],
      false,
    );

  await writeFile(path.join(RAIZ, 'src/fonts/fuentes.generated.js'), contenido);

  if (!titulo.length || !news.length) {
    const faltan = [!titulo.length && 'Breve Sans Title', !news.length && 'Breve News']
      .filter(Boolean)
      .join(' y ');
    console.warn(
      `Aviso: no se encontraron los archivos de ${faltan} en src/fonts/breve/. ` +
        'Se usa el respaldo: IBM Plex Sans para titulares y una serif del sistema para frases editoriales.',
    );
  }
}

await copiarLogos();
await generarModuloFuentes();
await optimizarImagenes();

const pendientes = spawnSync(
  process.execPath,
  [
    path.join(RAIZ, 'scripts/pendientes.mjs'),
    ...(produccion ? ['--verificar'] : ['--solo-consola']),
  ],
  { stdio: 'inherit' },
);
if (pendientes.status !== 0) process.exit(pendientes.status ?? 1);
