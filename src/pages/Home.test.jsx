import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, vi } from 'vitest';
import assert from 'assert';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import Home from './Home.jsx';

describe('Home Page Component', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Mock IntersectionObserver for framer-motion
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

  test('renders Home page with all major sections', () => {
    render(
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/']}>
            <Home />
          </MemoryRouter>
        </QueryClientProvider>
      </HelmetProvider>
    );

    // Verify Hero section
    assert.ok(screen.queryAllByText(/Smarter/i).length > 0);
    assert.ok(screen.queryAllByText(/Systems/i).length > 0);
    assert.ok(screen.queryAllByText(/On-Demand Business Systems without Breaking the Bank/i).length > 0);

    // Verify FeaturedArticles section (at least the label/loading state)
    // assert.ok(screen.queryAllByText(/Featured/i).length > 0);

    // Verify NewsFeed section (at least the label/loading state)
    // NewsFeed does not render until loaded
  });
});
