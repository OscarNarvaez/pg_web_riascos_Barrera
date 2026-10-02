import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Imagen from './Imagen';

const datos = {
  'inicio-hero': {
    ancho: 2880,
    alto: 1620,
    anchos: [640, 1024, 1600, 2400],
    lqip: 'data:image/webp;base64,AAA',
  },
  'inicio-hero-movil': {
    ancho: 1290,
    alto: 1612,
    anchos: [640, 1024, 1290],
    lqip: 'data:image/webp;base64,BBB',
  },
};

describe('<Imagen>', () => {
  it('sin archivo, reserva un espacio con la proporción exacta del Anexo B', () => {
    const { container } = render(<Imagen nombre="firma-portada" alt="Oficina" datos={{}} />);
    const espacio = container.querySelector('[data-imagen-pendiente="firma-portada"]');
    expect(espacio).toHaveStyle({ aspectRatio: '21 / 9' });
    expect(screen.getByRole('img', { name: 'Oficina' })).toBe(espacio);
  });

  it('sin archivo y decorativa, se oculta a los lectores de pantalla', () => {
    const { container } = render(<Imagen nombre="firma-portada" alt="" datos={{}} />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('con archivo, sirve WebP con srcset y dimensiones explícitas', () => {
    render(
      <Imagen nombre="inicio-hero" alt="Oficina" datos={{ 'inicio-hero': datos['inicio-hero'] }} />,
    );
    const img = screen.getByRole('img', { name: 'Oficina' });
    expect(img).toHaveAttribute('width', '2880');
    expect(img).toHaveAttribute('height', '1620');
    expect(img.getAttribute('srcset')).toContain('/imagenes/inicio-hero-1600.webp 1600w');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('prioritaria, carga de inmediato con prioridad alta', () => {
    render(<Imagen nombre="inicio-hero" alt="Oficina" prioritaria datos={datos} />);
    const img = screen.getByRole('img', { name: 'Oficina' });
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('fetchpriority', 'high');
  });

  it('con variante móvil, usa <picture> con su propio encuadre', () => {
    const { container } = render(<Imagen nombre="inicio-hero" alt="Oficina" datos={datos} />);
    const source = container.querySelector('picture > source');
    expect(source).toHaveAttribute('media', '(max-width: 767px)');
    expect(source.getAttribute('srcset')).toContain('inicio-hero-movil-1290.webp');
  });

  it('rechaza nombres fuera del inventario', () => {
    expect(() => render(<Imagen nombre="foto-inventada" alt="" datos={{}} />)).toThrow(/Anexo B/);
  });
});
