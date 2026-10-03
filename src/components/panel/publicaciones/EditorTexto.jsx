'use client';

import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Boton from '@/components/ui/Boton';
import Campo from '@/components/ui/Campo';
import {
  editorTexto as t,
  errores,
  mensajeCampo,
  panel,
  publicaciones as tp,
} from '@/content/es/panel';
import { clientePanel } from '@/lib/panel/cliente';
import { codigoDeError } from '@/lib/panel/errores';
import { ANCHOS_CUERPO, errorDeArchivo, subirImagen } from '@/lib/panel/imagenes';
import { errorDeUrl } from '@/lib/panel/validacion';
import { urlPublica } from '@/lib/supabase';
import Aviso from '../ui/Aviso';
import Dialogo from '../ui/Dialogo';

/**
 * Editor TipTap del cuerpo de una publicación (§7.2): títulos, párrafos, listas, negritas,
 * cursivas, citas, enlaces e imágenes con texto alternativo obligatorio. Solo se habilita lo que
 * permite el saneado del sitio (src/lib/sanear.js); el HTML se sanea de nuevo al guardar.
 */
const extensiones = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    code: false,
    codeBlock: false,
    horizontalRule: false,
    strike: false,
    underline: false,
    link: {
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
      protocols: ['http', 'https', 'mailto'],
      HTMLAttributes: { target: '_blank', rel: 'noopener noreferrer' },
    },
  }),
  Image.configure({ inline: false, allowBase64: false }),
];

/** @param {{ etiqueta: string, activo?: boolean, alPulsar: () => void, deshabilitado?: boolean, children: import('react').ReactNode }} props */
function BotonBarra({ etiqueta, activo, alPulsar, deshabilitado = false, children }) {
  return (
    <button
      type="button"
      // El clic con el ratón no quita el foco al texto: así Enter sigue escribiendo en el editor
      // y no vuelve a activar el botón. Con el teclado, los botones se alcanzan con Tab.
      onMouseDown={(e) => e.preventDefault()}
      onClick={alPulsar}
      disabled={deshabilitado}
      aria-pressed={activo === undefined ? undefined : activo}
      title={etiqueta}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-control px-3 text-pequeno font-medium disabled:opacity-40 ${
        activo ? 'bg-verde text-marfil' : 'text-verde hover:bg-verde/10'
      }`}
    >
      {children}
    </button>
  );
}

/**
 * Los diálogos de enlace e imagen tienen sus propios formularios: el editor no debe estar dentro
 * de otro <form>.
 *
 * @param {{
 *   valorInicial: string, alCambiar: (v: { html: string, texto: string }) => void,
 *   idEtiqueta: string, error?: string,
 * }} props `idEtiqueta` es el id del rótulo visible; el mensaje de error va en `${idEtiqueta}-error`.
 */
export default function EditorTexto({ valorInicial, alCambiar, idEtiqueta, error }) {
  const [dialogo, setDialogo] = useState(/** @type {null | 'enlace' | 'imagen' | 'alt'} */ (null));
  const [errorDialogo, setErrorDialogo] = useState('');
  const [subiendo, setSubiendo] = useState(false);

  // TipTap compara las opciones en cada render y, si alguna cambió, las vuelve a aplicar, lo que
  // reinicia el documento. Por eso el contenido inicial, las propiedades y el callback son estables:
  // el editor es la fuente de verdad mientras se escribe.
  const [opciones] = useState(() => ({
    content: valorInicial,
    editorProps: {
      attributes: {
        class: 'prosa min-h-80 max-w-none px-5 py-4 focus:outline-none',
        'aria-labelledby': idEtiqueta,
        'aria-describedby': `${idEtiqueta}-error`,
        'aria-multiline': 'true',
        role: 'textbox',
      },
    },
  }));
  const avisar = useRef(alCambiar);
  useEffect(() => {
    avisar.current = alCambiar;
  }, [alCambiar]);

  const editor = useEditor({
    extensions: extensiones,
    ...opciones,
    // Exportación estática: el editor solo existe en el navegador.
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => avisar.current({ html: e.getHTML(), texto: e.getText() }),
  });

  const estado = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            parrafo: e.isActive('paragraph'),
            h2: e.isActive('heading', { level: 2 }),
            h3: e.isActive('heading', { level: 3 }),
            negrita: e.isActive('bold'),
            cursiva: e.isActive('italic'),
            lista: e.isActive('bulletList'),
            numerada: e.isActive('orderedList'),
            cita: e.isActive('blockquote'),
            enlace: e.isActive('link'),
            imagen: e.isActive('image'),
            altActual: e.getAttributes('image').alt ?? '',
            urlActual: e.getAttributes('link').href ?? '',
            deshacer: e.can().undo(),
            rehacer: e.can().redo(),
          }
        : null,
  });

  const cadena = () => editor.chain().focus();
  const cerrarDialogo = () => {
    setDialogo(null);
    setErrorDialogo('');
  };

  /** @param {import('react').FormEvent<HTMLFormElement>} e */
  function aplicarEnlace(e) {
    e.preventDefault();
    e.stopPropagation();
    const url = String(new FormData(e.currentTarget).get('url') ?? '').trim();
    const esCorreo = /^mailto:[^@\s]+@[^@\s]+$/.test(url);
    const codigo = esCorreo ? null : errorDeUrl(url);
    if (codigo) {
      setErrorDialogo(mensajeCampo(codigo));
      return;
    }
    cadena().extendMarkRange('link').setLink({ href: url }).run();
    cerrarDialogo();
  }

  /** @param {import('react').FormEvent<HTMLFormElement>} e */
  async function insertarImagen(e) {
    e.preventDefault();
    e.stopPropagation();
    const datos = new FormData(e.currentTarget);
    const archivo = /** @type {File} */ (datos.get('archivo'));
    const alt = String(datos.get('alt') ?? '').trim();
    const codigo =
      errorDeArchivo(archivo?.size ? archivo : null) ?? (alt ? null : 'alt_obligatorio');
    if (codigo) {
      setErrorDialogo(mensajeCampo(codigo));
      return;
    }
    setSubiendo(true);
    try {
      const { ruta } = await subirImagen(clientePanel(), archivo, ANCHOS_CUERPO);
      cadena()
        .setImage({ src: urlPublica(ruta), alt })
        .run();
      cerrarDialogo();
    } catch (fallo) {
      setErrorDialogo(errores[codigoDeError(fallo) ?? 'desconocido'] ?? errores.desconocido);
    } finally {
      setSubiendo(false);
    }
  }

  /** @param {import('react').FormEvent<HTMLFormElement>} e */
  function cambiarAlt(e) {
    e.preventDefault();
    e.stopPropagation();
    const alt = String(new FormData(e.currentTarget).get('alt') ?? '').trim();
    if (!alt) {
      setErrorDialogo(mensajeCampo('alt_obligatorio'));
      return;
    }
    cadena().updateAttributes('image', { alt }).run();
    cerrarDialogo();
  }

  const s = estado ?? {};
  return (
    <div
      className={`overflow-hidden rounded-control border bg-marfil ${error ? 'border-oro' : 'border-verde/20'} focus-within:border-oro`}
    >
      <div
        role="toolbar"
        aria-label={t.barra}
        className="flex flex-wrap gap-1 border-b border-verde/10 bg-oliva/10 p-1.5"
      >
        <BotonBarra
          etiqueta={t.parrafo}
          activo={s.parrafo}
          alPulsar={() => cadena().setParagraph().run()}
        >
          {t.parrafo}
        </BotonBarra>
        <BotonBarra
          etiqueta={t.titulo}
          activo={s.h2}
          alPulsar={() => cadena().toggleHeading({ level: 2 }).run()}
        >
          {t.titulo}
        </BotonBarra>
        <BotonBarra
          etiqueta={t.subtitulo}
          activo={s.h3}
          alPulsar={() => cadena().toggleHeading({ level: 3 }).run()}
        >
          {t.subtitulo}
        </BotonBarra>
        <BotonBarra
          etiqueta={t.negrita}
          activo={s.negrita}
          alPulsar={() => cadena().toggleBold().run()}
        >
          <strong aria-hidden="true">N</strong>
          <span className="sr-only">{t.negrita}</span>
        </BotonBarra>
        <BotonBarra
          etiqueta={t.cursiva}
          activo={s.cursiva}
          alPulsar={() => cadena().toggleItalic().run()}
        >
          <em aria-hidden="true">C</em>
          <span className="sr-only">{t.cursiva}</span>
        </BotonBarra>
        <BotonBarra
          etiqueta={t.lista}
          activo={s.lista}
          alPulsar={() => cadena().toggleBulletList().run()}
        >
          {t.lista}
        </BotonBarra>
        <BotonBarra
          etiqueta={t.listaNumerada}
          activo={s.numerada}
          alPulsar={() => cadena().toggleOrderedList().run()}
        >
          {t.listaNumerada}
        </BotonBarra>
        <BotonBarra
          etiqueta={t.cita}
          activo={s.cita}
          alPulsar={() => cadena().toggleBlockquote().run()}
        >
          {t.cita}
        </BotonBarra>
        <BotonBarra etiqueta={t.enlace} activo={s.enlace} alPulsar={() => setDialogo('enlace')}>
          {t.enlace}
        </BotonBarra>
        {s.enlace && (
          <BotonBarra
            etiqueta={t.quitarEnlace}
            alPulsar={() => cadena().extendMarkRange('link').unsetLink().run()}
          >
            {t.quitarEnlace}
          </BotonBarra>
        )}
        <BotonBarra etiqueta={t.imagen} alPulsar={() => setDialogo('imagen')}>
          {t.imagen}
        </BotonBarra>
        {s.imagen && (
          <BotonBarra etiqueta={t.textoAlternativo} alPulsar={() => setDialogo('alt')}>
            {t.textoAlternativo}
          </BotonBarra>
        )}
        <BotonBarra
          etiqueta={t.deshacer}
          deshabilitado={!s.deshacer}
          alPulsar={() => cadena().undo().run()}
        >
          {t.deshacer}
        </BotonBarra>
        <BotonBarra
          etiqueta={t.rehacer}
          deshabilitado={!s.rehacer}
          alPulsar={() => cadena().redo().run()}
        >
          {t.rehacer}
        </BotonBarra>
      </div>

      <EditorContent editor={editor} />

      <Dialogo abierto={dialogo === 'enlace'} alCerrar={cerrarDialogo} titulo={t.dialogoEnlace}>
        <form onSubmit={aplicarEnlace} noValidate className="flex flex-col gap-2">
          <Campo
            etiqueta={t.urlEnlace}
            nombre="url"
            tipo="url"
            defaultValue={s.urlActual}
            obligatorio
            error={errorDialogo}
          />
          <div className="flex justify-end gap-3">
            <Boton variante="contorno" onClick={cerrarDialogo}>
              {panel.cancelar}
            </Boton>
            <Boton type="submit">{t.aplicar}</Boton>
          </div>
        </form>
      </Dialogo>

      <Dialogo abierto={dialogo === 'imagen'} alCerrar={cerrarDialogo} titulo={t.dialogoImagen}>
        <form onSubmit={insertarImagen} noValidate className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="font-medium">{t.archivoImagen}</span>
            <span className="text-pequeno text-verde-gris">{t.archivoAyuda}</span>
            <input
              type="file"
              name="archivo"
              accept="image/jpeg,image/png,image/webp"
              className="min-h-11 file:mr-4 file:min-h-11 file:rounded-pildora file:border file:border-verde/25 file:bg-marfil file:px-4 file:text-verde"
            />
          </label>
          <Campo etiqueta={t.dialogoAlt} nombre="alt" obligatorio ayuda={tp.altAyuda} />
          <Aviso tipo="error">{errorDialogo}</Aviso>
          {subiendo && <Aviso>{tp.procesandoImagen}</Aviso>}
          <div className="flex justify-end gap-3">
            <Boton variante="contorno" onClick={cerrarDialogo}>
              {panel.cancelar}
            </Boton>
            <Boton type="submit" disabled={subiendo}>
              {t.insertar}
            </Boton>
          </div>
        </form>
      </Dialogo>

      <Dialogo abierto={dialogo === 'alt'} alCerrar={cerrarDialogo} titulo={t.dialogoAlt}>
        <form onSubmit={cambiarAlt} noValidate className="flex flex-col gap-2">
          <Campo
            etiqueta={t.dialogoAlt}
            nombre="alt"
            defaultValue={s.altActual}
            obligatorio
            ayuda={tp.altAyuda}
            error={errorDialogo}
          />
          <div className="flex justify-end gap-3">
            <Boton variante="contorno" onClick={cerrarDialogo}>
              {panel.cancelar}
            </Boton>
            <Boton type="submit">{t.aplicar}</Boton>
          </div>
        </form>
      </Dialogo>
    </div>
  );
}
