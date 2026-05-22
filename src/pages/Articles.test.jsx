import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, vi } from 'vitest';
import assert from 'assert';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import Articles from './Articles.jsx';

describe('Articles Page Component', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  afterEach(() => {
    cleanup();
  });

  test('renders Articles page', async () => {
    render(
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/articles']}>
            <Articles />
          </MemoryRouter>
        </QueryClientProvider>
      </HelmetProvider>
    );

    // Verify it renders the Hero section or skeleton loader parts or section headings
    assert.ok(
      screen.queryByText(/Articles./i) ||
      screen.queryByText(/Strategic insights, partner integrations/i) ||
      screen.queryByText(/Featured/i) ||
      document.querySelector('.animate-pulse')
    );

    await waitFor(() => {
      assert.ok(
        screen.queryByText(/Articles./i) ||
        screen.queryByText(/Strategic insights, partner integrations/i)
      );
    }, { timeout: 3000 });
  });
});
