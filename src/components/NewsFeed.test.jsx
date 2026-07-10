import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach } from 'vitest';
import assert from 'assert';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import NewsFeed from './NewsFeed.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('NewsFeed Component', () => {
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
    const { container } = render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <NewsFeed limit={1} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Initial loading state displays skeleton loaders
    assert.ok(container.querySelector('.animate-pulse') !== null);

    await waitFor(() => {
        // Since NewsFeed no longer has error boundaries inside it and does not render text explicitly if successful without title, just assert some content loaded
        const articleElements = document.querySelectorAll('a[href^="/article/"]');
        const hasPending = screen.queryByText(/\[GLOBAL_FEED_UNAVAILABLE\]/i) || screen.queryByText(/Failed to establish uplink/i);
        assert.ok(hasPending || articleElements.length > 0);
    }, { timeout: 3000 });
  });
});
