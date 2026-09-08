import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Support from './Support.jsx';

vi.mock('../lib/telemetry', () => ({
  logTelemetry: vi.fn(),
  trackEvent: vi.fn(),
}));

describe('Support Component', () => {
  it('renders successfully', () => {
    const { container } = render(
      <HelmetProvider>
        <BrowserRouter>
          <Support />
        </BrowserRouter>
      </HelmetProvider>
    );

    expect(screen.getByText('System')).toBeTruthy();
  });
});
