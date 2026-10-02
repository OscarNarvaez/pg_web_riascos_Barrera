import PaginaPolitica from '@/components/PaginaPolitica';
import { interfaz } from '@/content/es/interfaz';
import { leerPolitica } from '@/lib/legal';

export const metadata = { title: interfaz.paginas.privacidad };

/** Política de privacidad (§5.8). */
export default async function PoliticaDePrivacidad() {
  return <PaginaPolitica politica={await leerPolitica('politica-privacidad')} />;
}
