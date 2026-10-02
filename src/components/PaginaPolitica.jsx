import EncabezadoPagina from '@/components/EncabezadoPagina';
import Pendiente from '@/components/Pendiente';
import { interfaz } from '@/content/es/interfaz';

/**
 * Página de una política legal (§5.8). El texto lo entrega la firma: mientras sea un marcador,
 * se ve resaltado en desarrollo y no se muestra en producción (§14.4).
 * El HTML viene de un archivo Markdown del propio repositorio, no de terceros.
 *
 * @param {{ politica: import('@/lib/legal').Politica }} props
 */
export default function PaginaPolitica({ politica }) {
  const t = interfaz.legal;
  return (
    <>
      <EncabezadoPagina titulo={politica.titulo} />
      <div className="contenedor-lectura flex flex-col gap-10 pb-(--espacio-seccion)">
        {politica.html ? (
          <>
            <p className="text-pequeno text-verde-gris">
              {t.version} {politica.version}
              <Pendiente valor={politica.vigencia}>{(v) => ` · ${t.vigencia} ${v}`}</Pendiente>
            </p>
            <div className="prosa" dangerouslySetInnerHTML={{ __html: politica.html }} />
          </>
        ) : (
          // Sin texto entregado, la versión no significa nada: solo el marcador, y en producción nada.
          <Pendiente valor={politica.cuerpo}>{null}</Pendiente>
        )}
      </div>
    </>
  );
}
