import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import FeaturedArticles from './FeaturedArticles.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('FeaturedArticles Component', () => {
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

  test('renders loading state initially and then shows articles or pending state', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <FeaturedArticles categorySlug="featured" limit={1} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    assert.ok(screen.getByText(/ESTABLISHING_SECURE_UPLINK.../i));

    // We don't need to strictly mock the fetch here since we just want to verify
    // it handles the component transitions correctly.
    await waitFor(() => {
        const hasPending = screen.queryByText(/\[INTELLIGENCE_FEED_PENDING\] \/\/ AWAITING_NETWORK_SYNC/i);
        const hasArticles = screen.queryByText(/Featured/i);
        assert.ok(hasPending || hasArticles);
    }, { timeout: 3000 });
  });
});
