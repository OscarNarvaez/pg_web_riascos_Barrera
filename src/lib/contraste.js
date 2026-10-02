/**
 * Contraste WCAG 2.1 entre colores hexadecimales (especificación §9.3).
 */

/** @param {string} hex */
function rgb(hex) {
  const h = hex.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

/** @param {number} c Canal de 0 a 255. */
function lineal(c) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

/** @param {string} hex */
export function luminancia(hex) {
  const [r, g, b] = rgb(hex).map(lineal);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * @param {string} a
 * @param {string} b
 */
export function contraste(a, b) {
  const [l1, l2] = [luminancia(a), luminancia(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * Color resultante de superponer `frente` con opacidad `alfa` sobre `fondo`.
 * @param {string} frente
 * @param {string} fondo
 * @param {number} alfa
 */
export function mezclar(frente, fondo, alfa) {
  const f = rgb(frente);
  const g = rgb(fondo);
  return `#${f
    .map((c, i) =>
      Math.round(c * alfa + g[i] * (1 - alfa))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
}
