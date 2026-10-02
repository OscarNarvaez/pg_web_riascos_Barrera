/**
 * Primera oración de un texto, para descripciones de metadatos tomadas del Anexo A.
 * @param {string} texto
 */
export function primeraOracion(texto) {
  const fin = texto.search(/\.\s/);
  return fin === -1 ? texto : texto.slice(0, fin + 1);
}
