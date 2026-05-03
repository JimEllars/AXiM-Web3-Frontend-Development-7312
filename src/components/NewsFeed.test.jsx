import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach } from 'node:test';
import assert from 'node:assert';
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

    // Initial loading state is null, so it renders nothing
    assert.strictEqual(container.firstChild, null);

    await waitFor(() => {
        const hasPending = screen.queryByText(/\[GLOBAL_FEED_UNAVAILABLE\]/i);
        const hasArticles = screen.queryByText(/All Articles/i);
        assert.ok(hasPending || hasArticles);
    }, { timeout: 3000 });
  });
});
