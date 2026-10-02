import { describe, expect, it } from 'vitest';
import { leerPolitica, separarEncabezado } from './legal';

describe('políticas legales (§5.8)', () => {
  it('separa el encabezado del cuerpo', () => {
    const { datos, cuerpo } = separarEncabezado(
      '---\ntitulo: Política\nversion: 2\nvigencia: "1 de enero"\n---\n\nTexto.',
    );
    expect(datos).toEqual({ titulo: 'Política', version: '2', vigencia: '1 de enero' });
    expect(cuerpo).toBe('Texto.');
  });

  it('convierte el Markdown entregado por la firma', async () => {
    const { datos, cuerpo } = separarEncabezado('---\ntitulo: X\n---\n## Alcance\n\n- uno');
    expect(datos.titulo).toBe('X');
    expect(cuerpo).toContain('## Alcance');
  });

  it.each(['politica-privacidad', 'politica-tratamiento-datos'])(
    'mientras %s esté pendiente, no se genera HTML',
    async (nombre) => {
      const politica = await leerPolitica(nombre);
      expect(politica.titulo).not.toBe('');
      expect(politica.html).toBeNull();
    },
  );
});
