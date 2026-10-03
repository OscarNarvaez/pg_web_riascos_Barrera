/**
 * Saneado del HTML de las publicaciones con DOMPurify isomórfico (especificación §3.3 y §13):
 * se aplica al compilar y en el navegador (respaldo de 404 y vista previa del panel).
 * Solo se permite lo que produce el editor TipTap (§7.2). El h1 se admite para convertirlo en h2.
 */
import DOMPurify from 'isomorphic-dompurify';

const ETIQUETAS = [
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'ul',
  'ol',
  'li',
  'strong',
  'em',
  'b',
  'i',
  'u',
  's',
  'blockquote',
  'a',
  'img',
  'br',
  'hr',
  'figure',
  'figcaption',
  'code',
  'pre',
];
const ATRIBUTOS = ['href', 'target', 'rel', 'src', 'alt', 'width', 'height', 'title'];

/**
 * Las imágenes del cuerpo solo pueden venir del bucket de publicaciones (§6.5): las sube el
 * panel. Una imagen externa pegada desde otro documento podría ser un píxel de seguimiento.
 */
function esImagenPropia(src) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(base) && (src ?? '').startsWith(`${base}/storage/v1/object/public/publicaciones/`);
}

let configurado = false;

function configurar() {
  if (configurado) return;
  configurado = true;
  DOMPurify.addHook('afterSanitizeAttributes', (nodo) => {
    // Todo enlace que abre otra pestaña lleva rel seguro.
    if (nodo.tagName === 'A' && nodo.getAttribute('target') === '_blank') {
      nodo.setAttribute('rel', 'noopener noreferrer');
    }
    if (nodo.tagName === 'IMG' && !esImagenPropia(nodo.getAttribute('src'))) nodo.remove();
  });
}

/**
 * @param {string} html
 * @returns {string}
 */
export function sanearHtml(html) {
  configurar();
  const limpio = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ETIQUETAS,
    ALLOWED_ATTR: ATRIBUTOS,
    ALLOW_DATA_ATTR: false,
  });
  // La página ya tiene su h1 (el título): los títulos del cuerpo empiezan en h2 (§10).
  return limpio.replace(/<(\/?)h1(\s|>)/gi, '<$1h2$2');
}
