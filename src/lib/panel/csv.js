/**
 * Exportación a CSV en el navegador (§7.2, módulo Contactos).
 *
 * - Separador punto y coma y BOM UTF-8: Excel en español abre así el archivo con columnas y
 *   tildes correctas sin pasos de importación.
 * - Las celdas que empiezan por = + - @ (o tabulador y retorno) se anteponen con un apóstrofo:
 *   un contacto podría escribir una fórmula en su mensaje y ejecutarla al abrir el archivo
 *   (inyección de fórmulas en CSV).
 */

const SEPARADOR = ';';
const BOM = '﻿';

/** @param {unknown} valor */
export function celda(valor) {
  let texto = valor === null || valor === undefined ? '' : String(valor);
  if (/^[=+\-@\t\r]/.test(texto)) texto = `'${texto}`;
  if (/[";\r\n]/.test(texto)) texto = `"${texto.replace(/"/g, '""')}"`;
  return texto;
}

/**
 * @template T
 * @param {T[]} filas
 * @param {{ titulo: string, valor: (fila: T) => unknown }[]} columnas
 */
export function aCsv(filas, columnas) {
  const lineas = [
    columnas.map((c) => celda(c.titulo)).join(SEPARADOR),
    ...filas.map((f) => columnas.map((c) => celda(c.valor(f))).join(SEPARADOR)),
  ];
  return BOM + lineas.join('\r\n');
}

/**
 * Descarga un texto como archivo en el navegador.
 * @param {string} contenido
 * @param {string} nombre
 */
export function descargar(contenido, nombre) {
  const url = URL.createObjectURL(new Blob([contenido], { type: 'text/csv;charset=utf-8' }));
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
