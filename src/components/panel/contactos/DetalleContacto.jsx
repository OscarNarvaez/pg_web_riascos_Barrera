'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Boton from '@/components/ui/Boton';
import Campo from '@/components/ui/Campo';
import EnlaceSecundario from '@/components/ui/EnlaceSecundario';
import { rutasPanel } from '@/config/panel';
import { contactos as t, errores, panel } from '@/content/es/panel';
import { useConsulta } from '@/hooks/useConsulta';
import { clientePanel } from '@/lib/panel/cliente';
import { codigoDeError } from '@/lib/panel/errores';
import Aviso from '../ui/Aviso';
import EncabezadoSeccion from '../ui/EncabezadoSeccion';
import { GRUPOS, valorDe } from './columnas';

/** @param {{ titulo: string, campos: string[], contacto: any }} props */
function Grupo({ titulo, campos, contacto }) {
  const visibles = campos.filter((c) => valorDe(c, contacto) !== '');
  if (visibles.length === 0) return null;
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-titulo text-subtitulo">{titulo}</h2>
      <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-[12rem_1fr]">
        {visibles.map((c) => (
          <div key={c} className="contents">
            <dt className="text-pequeno text-verde-gris">{t.campos[c]}</dt>
            <dd className="[overflow-wrap:anywhere]">{valorDe(c, contacto)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** El formulario de seguimiento se monta con los valores ya cargados. */
function Seguimiento({ contacto }) {
  const [estado, setEstado] = useState(contacto.status);
  const [notas, setNotas] = useState(contacto.internal_notes ?? '');
  const [ocupado, setOcupado] = useState(false);
  const [aviso, setAviso] = useState(
    /** @type {{ tipo: 'exito' | 'error', texto: string } | null} */ (null),
  );

  /** @param {import('react').FormEvent<HTMLFormElement>} e */
  async function guardar(e) {
    e.preventDefault();
    setOcupado(true);
    // Solo estado y notas: el resto del contacto no se puede modificar (§6.3).
    const { error } = await clientePanel()
      .from('leads')
      .update({ status: estado, internal_notes: notas.trim() || null })
      .eq('id', contacto.id);
    setOcupado(false);
    setAviso(
      error
        ? { tipo: 'error', texto: errores[codigoDeError(error)] ?? errores.desconocido }
        : { tipo: 'exito', texto: panel.cambiosGuardados },
    );
  }

  return (
    <section className="flex flex-col gap-4 rounded-mosaico bg-oliva/15 p-5">
      <h2 className="font-titulo text-subtitulo">{t.gestion}</h2>
      <form onSubmit={guardar} className="flex flex-col gap-2">
        <Campo
          etiqueta={t.estado}
          nombre="estado"
          tipo="select"
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          opciones={Object.entries(t.estados).map(([valor, etiqueta]) => ({ valor, etiqueta }))}
        />
        <Campo
          etiqueta={t.notas}
          nombre="notas"
          tipo="textarea"
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          ayuda={t.notasAyuda}
        />
        {aviso && (
          <Aviso tipo={aviso.tipo} className="mb-4">
            {aviso.texto}
          </Aviso>
        )}
        <Boton type="submit" disabled={ocupado} className="self-start">
          {ocupado ? panel.guardando : panel.guardar}
        </Boton>
      </form>
    </section>
  );
}

/** Detalle de un contacto (§7.2): datos, mensaje, origen, evidencia del consentimiento y seguimiento. */
export default function DetalleContacto() {
  const id = useSearchParams().get('id');
  const {
    datos: contacto,
    error,
    cargando,
  } = useConsulta(
    () =>
      id
        ? clientePanel().from('leads').select('*').eq('id', id).maybeSingle()
        : Promise.resolve({ data: null, error: null }),
    [id],
  );

  const volver = <EnlaceSecundario href={rutasPanel.contactos}>{t.volver}</EnlaceSecundario>;
  if (cargando) return <p role="status">{panel.cargando}</p>;
  if (error || !contacto) {
    return (
      <>
        <EncabezadoSeccion titulo={t.tituloDetalle} antes={volver} />
        <Aviso tipo="error">{error ? errores[error] : t.noExiste}</Aviso>
      </>
    );
  }

  return (
    <>
      <EncabezadoSeccion titulo={contacto.name} antes={volver} />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-10">
          <Grupo titulo={t.datos} campos={GRUPOS.datos} contacto={contacto} />
          <section className="flex flex-col gap-4">
            <h2 className="font-titulo text-subtitulo">{t.mensaje}</h2>
            <p className="max-w-prose [overflow-wrap:anywhere] whitespace-pre-line">
              {contacto.message}
            </p>
          </section>
          <Grupo titulo={t.atribucion} campos={GRUPOS.atribucion} contacto={contacto} />
          <Grupo titulo={t.consentimiento} campos={GRUPOS.consentimiento} contacto={contacto} />
        </div>
        <div className="self-start xl:sticky xl:top-8">
          <Seguimiento key={contacto.id} contacto={contacto} />
        </div>
      </div>
    </>
  );
}
