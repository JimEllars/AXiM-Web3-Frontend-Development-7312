import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FeaturedArticles from './FeaturedArticles.jsx';

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
    mock.restoreAll();
  });

  test('renders loading state initially', async () => {
    const fetchPosts = () => new Promise(() => {}); // Never resolves

    render(
      <QueryClientProvider client={queryClient}>
        <FeaturedArticles fetchPosts={fetchPosts} />
      </QueryClientProvider>
    );

    assert.ok(screen.getByText('Syncing with AXiM Intelligence...'));
  });

  test('renders DatabaseUplinkError when no posts are returned', async () => {
    const fetchPosts = async () => [];

    render(
      <QueryClientProvider client={queryClient}>
        <FeaturedArticles fetchPosts={fetchPosts} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      assert.ok(screen.getByText(/Establishing secure uplink to AXiM Database/i));
    });
  });

  test('renders fetched posts correctly', async () => {
    const mockPosts = [
      {
        id: 1,
        title: 'Test Article 1',
        excerpt: 'This is a test article excerpt.',
        link: 'https://axim.us.com/test-article-1',
        date: '2023-10-27T10:00:00Z',
        featuredImage: 'https://axim.us.com/image1.jpg'
      },
      {
        id: 2,
        title: 'Test Article 2',
        excerpt: 'This is another test article.',
        link: 'https://axim.us.com/test-article-2',
        date: '2023-10-28T10:00:00Z',
        featuredImage: null
      }
    ];

    const fetchPosts = async (slug) => {
      if (slug === 'featured') return mockPosts;
      return [];
    };

    render(
      <QueryClientProvider client={queryClient}>
        <FeaturedArticles title="My Custom Title" fetchPosts={fetchPosts} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      assert.ok(screen.getByText('My Custom Title'));
      assert.ok(screen.getByText('Test Article 1'));
      assert.ok(screen.getByText('This is a test article excerpt.'));
      assert.ok(screen.getByText('Test Article 2'));
      assert.ok(screen.getByText('This is another test article.'));

      const link1 = screen.getAllByRole('link').find(el => el.getAttribute('href') === 'https://axim.us.com/test-article-1');
      assert.ok(link1);

      const link2 = screen.getAllByRole('link').find(el => el.getAttribute('href') === 'https://axim.us.com/test-article-2');
      assert.ok(link2);
    });
  });

  test('falls back to fetching latest posts if category fetch is empty', async () => {
    const fetchPosts = async (slug) => {
      if (slug === 'featured') return [];
      if (slug === '') return [
        {
          id: 3,
          title: 'Fallback Article',
          excerpt: 'Fallback excerpt.',
          link: 'https://axim.us.com/fallback',
          date: '2023-10-29T10:00:00Z',
          featuredImage: null
        }
      ];
      return [];
    };

    render(
      <QueryClientProvider client={queryClient}>
        <FeaturedArticles categorySlug="featured" fetchPosts={fetchPosts} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      assert.ok(screen.getByText('Fallback Article'));
    });
  });

  test('falls back to default title if title prop is undefined', async () => {
    const fetchPosts = async () => [
      {
        id: 1,
        title: 'Test',
        excerpt: 'Test excerpt',
        link: 'https://axim.us.com/test',
        date: '2023-10-27T10:00:00Z',
        featuredImage: null
      }
    ];

    render(
      <QueryClientProvider client={queryClient}>
        <FeaturedArticles title={undefined} fetchPosts={fetchPosts} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      assert.ok(screen.getByText('Top Stories'));
    });
  });
});
