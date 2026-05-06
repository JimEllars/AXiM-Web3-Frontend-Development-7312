import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, vi } from 'vitest';
import assert from 'assert';
import { render, screen, cleanup } from '@testing-library/react';
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

  test('renders Articles page with correct headings and sections', () => {
    render(
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/articles']}>
            <Articles />
          </MemoryRouter>
        </QueryClientProvider>
      </HelmetProvider>
    );

    // Verify main headings
    assert.ok(screen.getAllByText('Intelligence Network').length > 0);
    assert.ok(screen.getByText('AXiM Articles'));
    assert.ok(screen.getByText(/Comprehensive insights, updates, and research from the AXiM ecosystem/i));

    // Verify tools widget
    assert.ok(screen.getByText('Explore AXiM Tools'));
    assert.ok(screen.getByRole('link', { name: /View All Tools/i }));

    // FeaturedArticles and NewsFeed will likely render their loading states initially
    // or their titles if they aren't fully loading yet
    // Since we don't mock the fetcher, it will be in loading state or show the title if we wait
    // We can just verify the tools section which is synchronous
  });
});
