import 'global-jsdom/register';
import { test, describe, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Tools from './Tools';

vi.mock('../lib/telemetry', () => ({
  logTelemetry: vi.fn()
}));

describe('Tools Page', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test('renders the tools page successfully', () => {
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={['/tools']}>
          <Routes>
            <Route path="/tools" element={<Tools />} />
          </Routes>
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByText('AXiM')).toBeTruthy();
    expect(screen.queryByText('Demand Letter Generator')).toBeNull(); // It's hidden behind the paywall
    expect(screen.queryByText('NDA Generator')).toBeNull();
  });
});