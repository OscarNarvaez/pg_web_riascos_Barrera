/**
 * Genera los íconos del sitio a partir del escudo oficial (especificación §9.7).
 *
 *   src/app/favicon.ico         16, 32 y 48 px, fondo transparente
 *   src/app/apple-icon.png      180 px, fondo marfil
 *   public/iconos/icono-192.png 192 px, fondo marfil (manifest)
 *   public/iconos/icono-512.png 512 px, fondo marfil (manifest)
 *
 * El escudo se escala sin deformarse ni recolorearse (regla 10). Siempre se reduce: el original
 * mide 322 × 393 px y el escudo nunca supera el 72 % del alto del ícono de 512 px.
 *
 * Falta favicon.svg: necesita el logotipo en vector, pendiente de la firma.
 * Ejecutar con `pnpm iconos` cuando cambien los logotipos; los resultados se versionan.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const RAIZ = path.resolve(import.meta.dirname, '..');
const ESCUDO = path.join(RAIZ, 'logos/logoR_B.webp');
const MARFIL = { r: 0xf9, g: 0xf8, b: 0xf2, alpha: 1 };
const TRANSPARENTE = { r: 0, g: 0, b: 0, alpha: 0 };

/**
 * @param {number} lado Tamaño del ícono cuadrado.
 * @param {number} proporcion Alto del escudo respecto al lado.
 * @param {object} fondo
 */
async function icono(lado, proporcion, fondo) {
  const alto = Math.round(lado * proporcion);
  const escudo = await sharp(ESCUDO)
    .resize({ height: alto, fit: 'inside', kernel: 'lanczos3' })
    .png()
    .toBuffer();
  return sharp({ create: { width: lado, height: lado, channels: 4, background: fondo } })
    .composite([{ input: escudo, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

await mkdir(path.join(RAIZ, 'public/iconos'), { recursive: true });

const ico = await pngToIco(
  await Promise.all([16, 32, 48].map((lado) => icono(lado, 1, TRANSPARENTE))),
);
await writeFile(path.join(RAIZ, 'src/app/favicon.ico'), ico);
await writeFile(path.join(RAIZ, 'src/app/apple-icon.png'), await icono(180, 0.72, MARFIL));
await writeFile(path.join(RAIZ, 'public/iconos/icono-192.png'), await icono(192, 0.72, MARFIL));
await writeFile(path.join(RAIZ, 'public/iconos/icono-512.png'), await icono(512, 0.72, MARFIL));

console.log('Íconos generados. Pendiente: favicon.svg (requiere el logotipo en SVG).');
