/**
 * Ejecuta las pruebas pgTAP de supabase/tests/database/ contra el proyecto vinculado
 * (especificación §15), sin Docker.
 *
 *   pnpm test:bd
 *
 * `supabase test db` necesita Docker incluso con --linked. Este script envía cada archivo por
 * `supabase db query --linked`, que no requiere Docker. Envuelve cada aserción para acumular su
 * línea de resultado y sustituye el cierre del archivo (`select * from finish(); rollback;`) por
 * una excepción que devuelve esas líneas. La excepción aborta la transacción: nada queda en la
 * base. Con Docker disponible, `supabase test db --linked` ejecuta los mismos archivos sin cambios.
 */
import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIR = path.join(RAIZ, 'supabase/tests/database');
const MARCA = '<<RESULTADOS_PGTAP>>';

// Funciones de pgTAP cuyas filas de resultado se recogen.
const ASERCIONES =
  /^(\s*select\s+)(ok|is|isnt|matches|imatches|doesnt_match|throws_ok|lives_ok|results_eq|set_eq|bag_eq|has_table|has_column|policies_are|is_empty|isnt_empty)\(/i;

// pgTAP 1.3 no guarda el texto de cada resultado: lo devuelve como fila de su select, y la
// consulta remota solo entrega el último. Cada aserción se envuelve en esta función, que
// acumula su línea TAP en una variable de la transacción.
const ACUMULADOR = `
create function pg_temp.tap(linea text) returns text language sql as $acumular$
  select set_config('tap.salida', coalesce(current_setting('tap.salida', true), '') || linea || chr(10), true)
$acumular$;
`;

const INFORME = `
do $informe$
begin
  raise exception '${MARCA}%${MARCA}', coalesce(current_setting('tap.salida', true), '');
end
$informe$;
`;

/** @param {string} sql */
function prepararArchivo(sql) {
  const cierre = /select\s+\*\s+from\s+finish\(\);\s*rollback;\s*$/i;
  if (!cierre.test(sql)) {
    throw new Error('Cada archivo debe terminar con: select * from finish(); rollback;');
  }
  const lineas = sql.replace(cierre, INFORME).split('\n');
  const salida = [];
  let dentro = false;
  for (const linea of lineas) {
    let l = linea;
    if (!dentro && ASERCIONES.test(l)) {
      l = l.replace(ASERCIONES, '$1pg_temp.tap($2(');
      dentro = true;
    }
    if (dentro && /;\s*$/.test(l)) {
      l = l.replace(/;\s*$/, ');');
      dentro = false;
    }
    salida.push(l);
    if (/^\s*select\s+plan\(/i.test(linea)) salida.push(ACUMULADOR);
  }
  return salida.join('\n');
}

/** @param {string} salida */
function extraerResultados(salida) {
  const texto = salida.replace(/\\\\n|\\n/g, '\n').replace(/\\+"/g, '"');
  const inicio = texto.indexOf(MARCA);
  const fin = texto.indexOf(MARCA, inicio + MARCA.length);
  if (inicio === -1 || fin === -1) return null;
  return texto
    .slice(inicio + MARCA.length, fin)
    .split('\n')
    .filter((l) => l.trim() !== '');
}

const archivos = (await readdir(DIR)).filter((f) => f.endsWith('.test.sql')).sort();
const temporal = await mkdtemp(path.join(tmpdir(), 'probar-bd-'));
let fallos = 0;

try {
  for (const archivo of archivos) {
    const sql = prepararArchivo(await readFile(path.join(DIR, archivo), 'utf8'));
    const ruta = path.join(temporal, archivo);
    await writeFile(ruta, sql);

    const r = spawnSync('supabase', ['db', 'query', '--linked', '-f', ruta], {
      cwd: RAIZ,
      encoding: 'utf8',
      timeout: 240_000,
    });
    const resultados = extraerResultados(`${r.stdout}\n${r.stderr}`);

    console.log(`\n# ${archivo}`);
    if (!resultados || resultados.length === 0) {
      fallos += 1;
      console.error('No se obtuvieron resultados. Salida de la CLI:');
      console.error(`${r.stdout}\n${r.stderr}`.trim());
      continue;
    }
    const plan = Number(sql.match(/plan\((\d+)\)/)?.[1] ?? 0);
    const ejecutadas = resultados.filter((l) => /^(not )?ok \d+/.test(l));
    for (const linea of resultados) {
      if (linea.startsWith('not ok')) fallos += 1;
      console.log(linea);
    }
    if (ejecutadas.length !== plan) {
      fallos += 1;
      console.error(`# Se planearon ${plan} pruebas y se ejecutaron ${ejecutadas.length}.`);
    }
    console.log(`1..${plan}`);
  }
} finally {
  await rm(temporal, { recursive: true, force: true });
}

console.log(
  fallos ? `\n${fallos} pruebas fallidas.` : '\nTodas las pruebas de base de datos pasaron.',
);
process.exit(fallos ? 1 : 0);
