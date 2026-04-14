import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import React from 'react';
import FeaturedArticles from './FeaturedArticles.jsx';
import { fetchCache } from '../lib/wp-fetch.js';

describe('FeaturedArticles Component', () => {
  beforeEach(() => {
    // Mock IntersectionObserver for framer-motion
    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    // Ensure cache is clear
    fetchCache.clear();
  });

  afterEach(() => {
    cleanup();
    mock.restoreAll();
    fetchCache.clear();
  });

  test('renders loading state initially', async () => {
    // Mock global fetch to never resolve
    mock.method(global, 'fetch', () => new Promise(() => {}));

    render(<FeaturedArticles />);

    assert.ok(screen.getByText('Syncing with AXiM Intelligence...'));
  });

  test('renders DatabaseUplinkError when no posts are returned', async () => {
    // Return empty array for categories, leading to fallback which also returns empty
    mock.method(global, 'fetch', async (url) => {
      return {
        ok: true,
        json: async () => []
      };
    });

    render(<FeaturedArticles />);

    await waitFor(() => {
      assert.ok(screen.getByText(/Establishing secure uplink to AXiM Database/i));
    });
  });

  test('renders fetched posts correctly', async () => {
    const mockPosts = [
      {
        id: 1,
        title: { rendered: 'Test Article 1' },
        excerpt: { rendered: 'This is a test article excerpt.' },
        link: 'https://axim.us.com/test-article-1',
        date: '2023-10-27T10:00:00Z',
        _embedded: {
            'wp:featuredmedia': [{ source_url: 'https://axim.us.com/image1.jpg' }]
        }
      },
      {
        id: 2,
        title: { rendered: 'Test Article 2' },
        excerpt: { rendered: 'This is another test article.' },
        link: 'https://axim.us.com/test-article-2',
        date: '2023-10-28T10:00:00Z'
      }
    ];

    mock.method(global, 'fetch', async (url) => {
      if (url.includes('/categories?slug=featured')) {
        return {
          ok: true,
          json: async () => [{ id: 42 }]
        };
      }
      if (url.includes('categories=42')) {
        return {
          ok: true,
          json: async () => mockPosts
        };
      }
      return { ok: true, json: async () => [] };
    });

    render(<FeaturedArticles title="My Custom Title" />);

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
    mock.method(global, 'fetch', async (url) => {
      if (url.includes('/categories?slug=featured')) {
        // Mock category fetch returns empty
        return {
          ok: true,
          json: async () => []
        };
      }

      // The fallback fetch fetches latest posts without category filter
      if (url.includes('/posts?orderby=date')) {
        return {
          ok: true,
          json: async () => [
            {
              id: 3,
              title: { rendered: 'Fallback Article' },
              excerpt: { rendered: 'Fallback excerpt.' },
              link: 'https://axim.us.com/fallback',
              date: '2023-10-29T10:00:00Z'
            }
          ]
        };
      }

      return { ok: true, json: async () => [] };
    });

    render(<FeaturedArticles categorySlug="featured" />);

    await waitFor(() => {
      assert.ok(screen.getByText('Fallback Article'));
    });
  });
});
