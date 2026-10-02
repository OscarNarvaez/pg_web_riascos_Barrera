import { espaciosDeImagen } from '@/config/imagenes';
import disponibles from '@/data/imagenes.generated.json';
import { conBase } from '@/lib/sitio';

const ES_DESARROLLO = process.env.NODE_ENV === 'development';

/**
 * Imagen del Anexo B por su nombre (especificación §11 y B.1).
 *
 * Si el archivo existe: <img> WebP con srcset, dimensiones explícitas y marcador de baja
 * resolución. Si existe además la variante "-movil", usa <picture> con su encuadre propio
 * por debajo de `puntoMovil`. Si no existe: un espacio con la proporción exacta, en un tinte
 * de la paleta; solo en desarrollo indica el archivo esperado y sus medidas.
 *
 * @param {object} props
 * @param {string} props.nombre Nombre del espacio, por ejemplo "inicio-hero".
 * @param {string} props.alt Texto alternativo (obligatorio; vacío solo si es decorativa).
 * @param {string} [props.sizes] Atributo sizes; por defecto, ancho completo.
 * @param {boolean} [props.prioritaria] Imagen del primer pantallazo: carga inmediata y prioridad alta.
 * @param {number} [props.puntoMovil] Ancho máximo en px en el que se usa la variante móvil.
 * @param {string} [props.className]
 * @param {Record<string, any>} [props.datos] Manifiesto alternativo, para pruebas.
 */
export default function Imagen({
  nombre,
  alt,
  sizes = '100vw',
  prioritaria = false,
  puntoMovil = 767,
  className = '',
  datos = disponibles,
}) {
  const espacio = espaciosDeImagen[nombre];
  if (!espacio) throw new Error(`<Imagen>: "${nombre}" no está en el inventario del Anexo B.`);

  const [pa, pb] = espacio.proporcion;
  const imagen = datos[nombre];

  if (!imagen) {
    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        data-imagen-pendiente={nombre}
        className={`relative overflow-hidden bg-oliva/15 ${className}`}
        style={{ aspectRatio: `${pa} / ${pb}` }}
      >
        {ES_DESARROLLO && (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-4 text-center text-pequeno text-verde-gris">
            <span className="font-medium text-verde">{nombre}</span>
            <span>
              {pa}:{pb} · mínimo {espacio.minimo.join(' × ')} px
            </span>
          </span>
        )}
      </div>
    );
  }

  const srcSet = (n, img) =>
    img.anchos.map((w) => `${conBase(`/imagenes/${n}-${w}.webp`)} ${w}w`).join(', ');
  const mayor = imagen.anchos.at(-1);
  const movil = datos[`${nombre}-movil`];

  const img = (
    <img
      src={conBase(`/imagenes/${nombre}-${mayor}.webp`)}
      srcSet={srcSet(nombre, imagen)}
      sizes={sizes}
      width={imagen.ancho}
      height={imagen.alto}
      alt={alt}
      loading={prioritaria ? 'eager' : 'lazy'}
      fetchPriority={prioritaria ? 'high' : undefined}
      decoding={prioritaria ? 'sync' : 'async'}
      className={`h-auto w-full bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url("${imagen.lqip}")` }}
    />
  );

  if (!movil) return img;

  return (
    <picture>
      <source
        media={`(max-width: ${puntoMovil}px)`}
        srcSet={srcSet(`${nombre}-movil`, movil)}
        sizes={sizes}
        width={movil.ancho}
        height={movil.alto}
      />
      {img}
    </picture>
  );
}
