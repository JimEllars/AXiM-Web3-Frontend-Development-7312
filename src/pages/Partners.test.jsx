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

    // Assert main headings and texts from the new structure
    expect(screen.getAllByText(/The AXiM/i)).toBeTruthy();
    expect(screen.getAllByText(/Network./i)).toBeTruthy();

    // Make.com
    expect(screen.getAllByText(/Make.com Automation/i)).toBeTruthy();

    // Powur Solar
    expect(screen.getAllByText(/Powur Residential Solar/i)).toBeTruthy();

    // Powur Agency
    expect(screen.getAllByText(/Powur Agency Partnership/i)).toBeTruthy();

    // Verify Links
    const links = screen.getAllByRole('link');
    const makeLinks = links.filter(l => l.getAttribute('href') === '/partners/make');
    const powurSolarLinks = links.filter(l => l.getAttribute('href') === '/partners/powur-solar');
    const powurAgencyLinks = links.filter(l => l.getAttribute('href') === '/partners/powur-join');

    expect(makeLinks.length).toBeGreaterThan(0);
    expect(powurSolarLinks.length).toBeGreaterThan(0);
    expect(powurAgencyLinks.length).toBeGreaterThan(0);
  });
});
