import AvisoCasos from '@/components/publicaciones/AvisoCasos';
import PaginaListado from '@/components/publicaciones/PaginaListado';
import { firma } from '@/config/firma';
import { obtenerContenido } from '@/lib/contenido';

export const metadata = { title: firma.nombreSeccionCasos };

/**
 * Listado de casos (§5.5). Por decisión del cliente la sección se llama "Casos de éxito" y, por
 * eso, el aviso de no garantía va también en el encabezado, no solo al final de cada caso.
 */
export default async function Casos() {
  const { publicaciones, etiquetas } = await obtenerContenido();
  const casos = publicaciones.filter((p) => p.tipo === 'caso');
  return (
    <PaginaListado
      titulo={firma.nombreSeccionCasos}
      aviso={<AvisoCasos className="max-w-prose text-subtitulo" />}
      publicaciones={casos}
      etiquetas={etiquetas}
      hayCasos
      filtro="casos"
    />
  );
}
