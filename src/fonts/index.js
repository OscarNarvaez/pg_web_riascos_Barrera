/**
 * Tipografías servidas desde el propio sitio (especificación §9.4). Sin Google Fonts.
 * IBM Plex Sans (SIL OFL) se versiona; Breve se descarga en la compilación. Las declaraciones
 * las genera scripts/preparar.mjs porque next/font solo acepta valores literales y la
 * precarga depende de si Breve está disponible.
 */
import { breveNews, breveTitle, plex } from './fuentes.generated.js';

/** Clases que declaran las variables de las tres familias en <html>. */
export const variablesDeFuentes = [plex.variable, breveTitle.variable, breveNews.variable]
  .filter(Boolean)
  .join(' ');
