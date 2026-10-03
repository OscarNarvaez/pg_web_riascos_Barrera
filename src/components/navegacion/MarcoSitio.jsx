import ProveedorMovimiento from '@/components/movimiento/ProveedorMovimiento';
import Encabezado from './Encabezado';
import PiePagina from './PiePagina';

/**
 * Armazón del sitio público: barra, contenido y pie (§4.3). Lo usan el layout del grupo (sitio) y
 * la página 404, que se renderiza fuera de los grupos. El panel tiene el suyo (§7) y no carga
 * nada de esto.
 *
 * @param {{ children: import('react').ReactNode }} props
 */
export default function MarcoSitio({ children }) {
  return (
    <ProveedorMovimiento>
      <Encabezado />
      <main id="contenido" className="flex-1">
        {children}
      </main>
      <PiePagina />
    </ProveedorMovimiento>
  );
}
