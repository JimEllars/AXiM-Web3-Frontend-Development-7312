import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup } from '@testing-library/react';
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

  test('renders stabilized state', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <FeaturedArticles categorySlug="featured" />
        </MemoryRouter>
      </QueryClientProvider>
    );

    assert.ok(screen.getByText(/\[FEATURED_ARTICLES_STABILIZED\] \/\/ AWAITING_SAFE_UPLINK/i));
  });
});
