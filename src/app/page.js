import AreasMosaico from '@/components/inicio/AreasMosaico';
import Cierre from '@/components/inicio/Cierre';
import Cobertura from '@/components/inicio/Cobertura';
import Entorno from '@/components/inicio/Entorno';
import EquipoVista from '@/components/inicio/EquipoVista';
import Hero from '@/components/inicio/Hero';
import Metodo from '@/components/inicio/Metodo';
import PensamosAntes from '@/components/inicio/PensamosAntes';
import Perspectivas from '@/components/inicio/Perspectivas';
import Promesa from '@/components/inicio/Promesa';
import QueHacemos from '@/components/inicio/QueHacemos';

/**
 * Inicio (§5.1): cada sección transmite una sola idea. A.2.5 no se publica por decisión del
 * cliente. La sección 11, "Publicaciones recientes", se añade en la Fase 3 y no aparece si no
 * hay publicaciones.
 */
export default function Inicio() {
  return (
    <>
      <Hero />
      <QueHacemos />
      <Entorno />
      <PensamosAntes />
      <AreasMosaico />
      <Perspectivas />
      <Metodo />
      <Promesa />
      <EquipoVista />
      <Cobertura />
      <Cierre />
    </>
  );
}
