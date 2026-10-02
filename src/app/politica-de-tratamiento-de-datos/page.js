import PaginaPolitica from '@/components/PaginaPolitica';
import { interfaz } from '@/content/es/interfaz';
import { leerPolitica } from '@/lib/legal';

export const metadata = { title: interfaz.paginas.tratamientoDatos };

/** Política de tratamiento de datos personales, Ley 1581 de 2012 (§5.8 y §8.3). */
export default async function PoliticaDeTratamientoDeDatos() {
  return <PaginaPolitica politica={await leerPolitica('politica-tratamiento-datos')} />;
}
