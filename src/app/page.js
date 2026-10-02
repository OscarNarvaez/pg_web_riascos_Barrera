import Logo from '@/components/Logo';
import { firma } from '@/config/firma';

/**
 * Esqueleto de la Fase 1: valida el despliegue en GitHub Pages, la ruta base, las fuentes y
 * los logotipos. El Inicio completo (§5.1) se construye en la Fase 2.
 */
export default function Inicio() {
  return (
    <section className="contenedor-lectura flex min-h-dvh flex-col items-start justify-center gap-8 espacio-seccion">
      <Logo className="h-14 w-auto sm:h-16" prioritario />
      <div className="flex flex-col gap-4">
        <h1 className="font-titulo text-display text-verde">{firma.concepto}</h1>
        <p className="font-editorial text-subtitulo text-verde-gris">{firma.subtitulo}</p>
      </div>
    </section>
  );
}
