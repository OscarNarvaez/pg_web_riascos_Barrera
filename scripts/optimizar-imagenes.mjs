/**
 * Optimiza las fotografías del Anexo B (especificación §11 y B.1).
 *
 * Toma los originales de imagenes/originales/ (jpg, jpeg, png o webp; importa el nombre, no la
 * extensión), genera WebP en los anchos de ANCHOS_IMAGEN que no superen el original, más un
 * marcador de baja resolución (LQIP), y escribe src/data/imagenes.generated.json.
 * Solo reprocesa un original si cambió desde la última ejecución.
 */
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { ANCHOS_IMAGEN, espaciosDeImagen } from '../src/config/imagenes.js';

const RAIZ = path.resolve(import.meta.dirname, '..');
const ORIGENES = path.join(RAIZ, 'imagenes/originales');
const DESTINO = path.join(RAIZ, 'public/imagenes');
const MANIFIESTO = path.join(RAIZ, 'src/data/imagenes.generated.json');
const EXTENSIONES = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const CALIDAD_WEBP = 78;

async function leerManifiestoPrevio() {
  try {
    return JSON.parse(await readFile(MANIFIESTO, 'utf8'));
  } catch {
    return {};
  }
}

/** @param {string} archivo */
async function huella(archivo) {
  return createHash('sha256')
    .update(await readFile(archivo))
    .digest('hex')
    .slice(0, 16);
}

/**
 * @param {string} origen
 * @param {string} nombre
 */
async function procesar(origen, nombre) {
  // rotate() aplica la orientación EXIF; sharp descarta los metadatos al exportar.
  const base = sharp(origen).rotate();
  const { width: ancho, height: alto } = await base
    .metadata()
    .then((m) => ((m.orientation ?? 1) >= 5 ? { width: m.height, height: m.width } : m));

  const anchos = ANCHOS_IMAGEN.filter((a) => a <= ancho);
  if (anchos.length === 0 || anchos.at(-1) < ancho) anchos.push(Math.min(ancho, 2400));
  const unicos = [...new Set(anchos)].sort((a, b) => a - b);

  for (const w of unicos) {
    await base
      .clone()
      .resize({ width: w })
      .webp({ quality: CALIDAD_WEBP, effort: 5 })
      .toFile(path.join(DESTINO, `${nombre}-${w}.webp`));
  }

  const lqip = await base.clone().resize({ width: 24 }).webp({ quality: 40 }).toBuffer();

  return {
    ancho,
    alto,
    anchos: unicos,
    lqip: `data:image/webp;base64,${lqip.toString('base64')}`,
  };
}

export async function optimizarImagenes() {
  await mkdir(DESTINO, { recursive: true });
  await mkdir(path.dirname(MANIFIESTO), { recursive: true });

  const previo = await leerManifiestoPrevio();
  const archivos = existsSync(ORIGENES) ? await readdir(ORIGENES) : [];
  /** @type {Record<string, any>} */
  const manifiesto = {};
  const avisos = [];

  for (const archivo of archivos.sort()) {
    const ext = path.extname(archivo).toLowerCase();
    if (!EXTENSIONES.has(ext)) continue;
    const nombre = path.basename(archivo, path.extname(archivo));
    const origen = path.join(ORIGENES, archivo);

    if (!espaciosDeImagen[nombre]) {
      avisos.push(`"${archivo}" no corresponde a ningún espacio del Anexo B; se ignora.`);
      continue;
    }
    if (manifiesto[nombre]) {
      avisos.push(`Hay más de un original para "${nombre}"; se usa el primero.`);
      continue;
    }

    const h = await huella(origen);
    const salidasPresentes = previo[nombre]?.anchos?.every((w) =>
      existsSync(path.join(DESTINO, `${nombre}-${w}.webp`)),
    );
    if (previo[nombre]?.huella === h && salidasPresentes) {
      manifiesto[nombre] = previo[nombre];
      continue;
    }

    const datos = await procesar(origen, nombre);
    manifiesto[nombre] = { ...datos, huella: h };

    const [minAncho, minAlto] = espaciosDeImagen[nombre].minimo;
    if (datos.ancho < minAncho || datos.alto < minAlto) {
      avisos.push(
        `"${nombre}" mide ${datos.ancho} × ${datos.alto}; el mínimo es ${minAncho} × ${minAlto}.`,
      );
    }
    console.log(`  imagen optimizada: ${nombre} (${datos.anchos.join(', ')} px)`);
  }

  // Elimina las salidas de originales que ya no existen.
  if (existsSync(DESTINO)) {
    for (const salida of await readdir(DESTINO)) {
      const nombre = salida.replace(/-\d+\.webp$/, '');
      if (!manifiesto[nombre]) await rm(path.join(DESTINO, salida));
    }
  }

  await writeFile(MANIFIESTO, `${JSON.stringify(manifiesto, null, 2)}\n`);
  for (const aviso of avisos) console.warn(`  aviso: ${aviso}`);
  return manifiesto;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const manifiesto = await optimizarImagenes();
  const total = Object.keys(espaciosDeImagen).length;
  console.log(`Imágenes disponibles: ${Object.keys(manifiesto).length} de ${total}.`);
}
