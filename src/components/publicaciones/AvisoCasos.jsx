import { textosPublicaciones as t } from '@/content/es/publicaciones';

/** Aviso obligatorio de los casos (§5.5): la experiencia previa no garantiza resultados. */
export default function AvisoCasos({ className = '' }) {
  return (
    <p className={`border-l border-oro pl-4 font-editorial text-verde ${className}`}>
      {t.avisoCasos}
    </p>
  );
}
