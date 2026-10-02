import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatearPendiente } from '@/lib/pendientes';

async function cargar(entorno) {
  vi.resetModules();
  vi.stubEnv('NODE_ENV', entorno);
  return (await import('./Pendiente')).default;
}

afterEach(() => vi.unstubAllEnvs());

describe('<Pendiente>', () => {
  const marcador = formatearPendiente('teléfono institucional');

  it('en desarrollo, muestra el marcador resaltado', async () => {
    const Pendiente = await cargar('development');
    render(<Pendiente valor={marcador}>{(v) => <a href={`tel:${v}`}>{v}</a>}</Pendiente>);
    expect(screen.getByText(marcador)).toHaveAttribute('data-pendiente');
    expect(screen.queryByRole('link')).toBeNull();
  });

  it('en producción, oculta el elemento', async () => {
    const Pendiente = await cargar('production');
    const { container } = render(<Pendiente valor={marcador}>visible</Pendiente>);
    expect(container).toBeEmptyDOMElement();
  });

  it('con un dato confirmado, renderiza el contenido', async () => {
    const Pendiente = await cargar('production');
    render(<Pendiente valor="Pasto">{(v) => <span>{v}</span>}</Pendiente>);
    expect(screen.getByText('Pasto')).toBeInTheDocument();
  });
});
