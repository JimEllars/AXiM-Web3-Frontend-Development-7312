import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeAll } from 'vitest';
import Partners from './Partners';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';

describe('Partners Page Component', () => {
  beforeAll(() => {
    const mockIntersectionObserver = class {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    global.IntersectionObserver = mockIntersectionObserver;
  });

  it('renders the page correctly', async () => {
    render(
      <MemoryRouter>
        <HelmetProvider>
          <Partners />
        </HelmetProvider>
      </MemoryRouter>
    );

    // Assert main headings and texts from the new collage
    expect(screen.getAllByText(/Curated by AXiM/i)).toBeTruthy();
    expect(screen.getAllByText(/World-Class/i)).toBeTruthy();
    expect(screen.getAllByText(/Solutions./i)).toBeTruthy();

    // Make.com
    expect(screen.getAllByText(/Automate Everything./i)).toBeTruthy();
    expect(screen.getAllByText(/No Coding Required./i)).toBeTruthy();

    // Powur Solar
    expect(screen.getAllByText(/Powur Solar/i)).toBeTruthy();
    expect(screen.getAllByText(/Decentralize Your/i)).toBeTruthy();

    // Powur Agency
    expect(screen.getAllByText(/Powur Agency/i)).toBeTruthy();
    expect(screen.getAllByText(/Scale A Cloud/i)).toBeTruthy();

    // Verify Links
    expect(screen.getByRole('link', { name: /Explore Make/i }).getAttribute('href')).toBe('/partners/make');
    expect(screen.getByRole('link', { name: /Calculate Savings/i }).getAttribute('href')).toBe('/partners/powur-solar');
    expect(screen.getByRole('link', { name: /Start Selling/i }).getAttribute('href')).toBe('/partners/powur-join');
  });
});
