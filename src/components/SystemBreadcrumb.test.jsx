import 'global-jsdom/register';
import { test, describe, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../lib/telemetry.js', () => ({
  logTelemetry: vi.fn()
}));

const SystemBreadcrumb = (await import('./SystemBreadcrumb.jsx')).default;

describe('SystemBreadcrumb Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test('renders properly with aria attributes', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard/business']}>
        <SystemBreadcrumb />
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeTruthy();
  });
});
