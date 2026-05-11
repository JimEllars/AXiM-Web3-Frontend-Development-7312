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

    // Assert main headings and texts
    expect(screen.getAllByText(/The AXiM Partner/i)).toBeTruthy();
    expect(screen.getAllByText(/Ecosystem/i)).toBeTruthy();
    expect(screen.getAllByText(/Rigorous Vetting/i)).toBeTruthy();
    expect(screen.getAllByText(/Seamless Integration/i)).toBeTruthy();
    expect(screen.getAllByText(/Scale & Earn/i)).toBeTruthy();

    expect(screen.getAllByText(/Digital Automation/i)).toBeTruthy();
    expect(screen.getAllByText(/Make.com Automation/i)).toBeTruthy();

    expect(screen.getAllByText(/Physical Infrastructure/i)).toBeTruthy();
    expect(screen.getAllByText(/Powur Solar/i)).toBeTruthy();
    expect(screen.getAllByText(/Powur Agency/i)).toBeTruthy();
  });
});
