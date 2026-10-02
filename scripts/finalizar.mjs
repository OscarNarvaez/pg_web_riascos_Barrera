/**
 * Paso posterior a `next build`: elimina de out/ las rutas de reserva de las páginas dinámicas
 * sin datos (ver RESERVA en src/config/publicaciones.js). Así responden con el 404 real de
 * GitHub Pages y no con una página 404 servida con código 200.
 */
import { readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { RESERVA } from '../src/config/publicaciones.js';

const OUT = path.resolve(import.meta.dirname, '../out');

const entradas = await readdir(OUT, { recursive: true, withFileTypes: true });
const reservas = entradas
  .filter((e) => e.name === RESERVA || e.name.startsWith(`${RESERVA}.`))
  .map((e) => path.join(e.parentPath, e.name));

for (const ruta of reservas) await rm(ruta, { recursive: true, force: true });
console.log(`Rutas de reserva eliminadas de out/: ${reservas.length}.`);
