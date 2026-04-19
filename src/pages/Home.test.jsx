import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach } from 'node:test';
import assert from 'node:assert';
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
    assert.ok(screen.getByText(/Smart Business/i));
    assert.ok(screen.getByText(/Systems/i));
    assert.ok(screen.getByText(/AXiM Systems integrates energy infrastructure/i));

    // Verify FeaturedArticles section (at least the label/loading state)
    assert.ok(screen.queryByText(/Featured Intelligence/i) || screen.queryByText(/Syncing with AXiM Intelligence/i));

    // Verify NewsFeed section (at least the label/loading state)
    assert.ok(screen.queryByText(/Intelligence Hub/i) || screen.queryByText(/Syncing with AXiM Intelligence/i));

    // Verify Ecosystem section
    assert.ok(screen.getByText(/The AXiM Ecosystem/i));
    assert.ok(screen.getByText(/Discover/i));
  });
});
