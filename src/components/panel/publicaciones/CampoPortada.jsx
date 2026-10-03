'use client';

import { useId, useRef, useState } from 'react';
import Boton from '@/components/ui/Boton';
import Campo from '@/components/ui/Campo';
import { VARIANTES_PORTADA } from '@/config/publicaciones';
import { errores, mensajeCampo, publicaciones as t } from '@/content/es/panel';
import { clientePanel } from '@/lib/panel/cliente';
import { codigoDeError } from '@/lib/panel/errores';
import { ANCHOS_PORTADA, errorDeArchivo, subirImagen } from '@/lib/panel/imagenes';
import { urlPublica } from '@/lib/supabase';
import Aviso from '../ui/Aviso';

/**
 * Portada de una publicación (§7.3): se valida, se convierte a WebP en el navegador, se suben
 * las variantes de 1600 y 800 px y se guarda la ruta de la mayor. El texto alternativo es
 * obligatorio si hay portada.
 *
 * @param {{
 *   ruta: string | null, alt: string, errorAlt?: string,
 *   alCambiarRuta: (ruta: string | null) => void, alCambiarAlt: (alt: string) => void,
 * }} props
 */
export default function CampoPortada({ ruta, alt, errorAlt, alCambiarRuta, alCambiarAlt }) {
  const entrada = useRef(/** @type {HTMLInputElement | null} */ (null));
  const idAyuda = useId();
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState('');

  /** @param {import('react').ChangeEvent<HTMLInputElement>} e */
  async function alElegir(e) {
    const archivo = e.target.files?.[0];
    e.target.value = '';
    if (!archivo) return;
    const codigo = errorDeArchivo(archivo);
    if (codigo) {
      setError(mensajeCampo(codigo));
      return;
    }
    setError('');
    setSubiendo(true);
    try {
      const { ruta: nueva } = await subirImagen(clientePanel(), archivo, ANCHOS_PORTADA);
      alCambiarRuta(nueva);
    } catch (fallo) {
      setError(errores[codigoDeError(fallo) ?? 'desconocido'] ?? errores.desconocido);
    } finally {
      setSubiendo(false);
    }
  }

  const vista = ruta
    ? urlPublica(ruta.replace(VARIANTES_PORTADA.grande, VARIANTES_PORTADA.mediana))
    : null;

  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="mb-2 font-medium text-verde">{t.portada}</legend>
      <p id={idAyuda} className="text-pequeno text-verde-gris">
        {t.portadaAyuda}
      </p>
      {vista && (
        <img
          src={vista}
          alt=""
          width={800}
          height={450}
          className="aspect-video w-full max-w-md rounded-mosaico bg-oliva/15 object-cover"
        />
      )}
      <div className="flex flex-wrap gap-3">
        <input
          ref={entrada}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={alElegir}
          aria-describedby={idAyuda}
          className="sr-only"
          tabIndex={-1}
        />
        <Boton
          variante="contorno"
          tamano="compacto"
          disabled={subiendo}
          onClick={() => entrada.current?.click()}
        >
          {ruta ? t.cambiarImagen : t.elegirImagen}
        </Boton>
        {ruta && (
          <Boton
            variante="contorno"
            tamano="compacto"
            disabled={subiendo}
            onClick={() => alCambiarRuta(null)}
          >
            {t.quitarImagen}
          </Boton>
        )}
      </div>
      {subiendo && <Aviso>{t.procesandoImagen}</Aviso>}
      <Aviso tipo="error">{error}</Aviso>
      {ruta && (
        <Campo
          etiqueta={t.portadaAlt}
          nombre="portadaAlt"
          value={alt}
          onChange={(e) => alCambiarAlt(e.target.value)}
          obligatorio
          ayuda={t.altAyuda}
          error={errorAlt}
        />
      )}
    </fieldset>
  );
}
