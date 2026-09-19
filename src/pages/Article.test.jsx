import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, expect, vi } from 'vitest';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import Article from './Article.jsx';

vi.mock('../lib/wp-fetch.js', () => ({
  fetchPosts: vi.fn((opts) => opts.slug ? Promise.resolve([{ id: 1, slug: 'test-article-slug', title: { rendered: 'Test Article' }, content: { rendered: '<p>Test content</p>' }, date: '2023-01-01T00:00:00Z', categories: [1] }]) : Promise.resolve([]))
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ slug: 'test-article-slug' })
  };
});

describe('Article Page Sidebar Links', () => {
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
    vi.clearAllMocks();
  });

  test('renders new public utility links and not old internal links', async () => {
    render(
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/article/test-article-slug']}>
            <Article />
          </MemoryRouter>
        </QueryClientProvider>
      </HelmetProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Ground Game Canvassing/i)).toBeTruthy();
    }, { timeout: 3000 });

    expect(screen.queryByText(/AXiM Core/i, { selector: 'span' })).toBeNull();
    expect(screen.queryByText(/Arc Remote/i, { selector: 'span' })).toBeNull();
    expect(screen.queryByText(/Coding Lab/i, { selector: 'span' })).toBeNull();

    expect(screen.getByText(/Demand Letter Generator/i)).toBeTruthy();
    expect(screen.getByText(/NDA Generator/i)).toBeTruthy();
    expect(screen.getByText(/Personality Test/i)).toBeTruthy();

    const demandLetterLink = screen.getByText(/Demand Letter Generator/i).closest('a');
    expect(demandLetterLink.getAttribute('href')).toBe('https://quickdemandletter.com');
    expect(demandLetterLink.getAttribute('target')).toBe('_blank');

    const ndaLink = screen.getByText(/NDA Generator/i).closest('a');
    expect(ndaLink.getAttribute('href')).toBe('https://nda.axim.us.com');
    expect(ndaLink.getAttribute('target')).toBe('_blank');

    const personalityLink = screen.getByText(/Personality Test/i).closest('a');
    expect(personalityLink.getAttribute('href')).toBe('https://axim.us.com/personalitytest/');
    expect(personalityLink.getAttribute('target')).toBe('_blank');

  });
});
