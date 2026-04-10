import 'global-jsdom/register';
import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import React from 'react';
import * as wpFetch from '../lib/wp-fetch.js';
import NewsFeed from './NewsFeed.jsx';

const originalFetchPostsByCategory = wpFetch.fetchPostsByCategory;

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('NewsFeed Component', () => {
  afterEach(() => {
    cleanup();
    Object.defineProperty(wpFetch, 'fetchPostsByCategory', {
      value: originalFetchPostsByCategory,
      configurable: true,
    });
  });

  function mockFetch(impl) {
    Object.defineProperty(wpFetch, 'fetchPostsByCategory', {
      value: impl,
      configurable: true,
    });
  }

  test('renders loading state initially', () => {
    mockFetch(async () => []);
    render(<NewsFeed />);
    assert.ok(screen.getByText('Syncing with AXiM Intelligence...'));
  });

  test('renders DatabaseUplinkError when no items are fetched', async () => {
    mockFetch(async () => []);
    render(<NewsFeed />);

    await waitFor(() => {
      assert.ok(screen.getByText(/Establishing secure uplink to AXiM Database.../));
    });
  });

  test('renders posts and interleaved offerings', async () => {
    const mockPosts = [
      { id: 1, title: 'Post 1', excerpt: 'Excerpt 1', link: 'https://axim.us.com/1', date: '2023-01-01T00:00:00Z', featuredImage: 'img1.jpg' },
      { id: 2, title: 'Post 2', excerpt: 'Excerpt 2', link: 'https://axim.us.com/2', date: '2023-01-02T00:00:00Z', featuredImage: 'img2.jpg' },
      { id: 3, title: 'Post 3', excerpt: 'Excerpt 3', link: 'https://axim.us.com/3', date: '2023-01-03T00:00:00Z', featuredImage: 'img3.jpg' }
    ];

    mockFetch(async () => mockPosts);
    render(<NewsFeed />);

    await waitFor(() => {
      // Posts should be rendered
      assert.ok(screen.getByText('Post 1'));
      assert.ok(screen.getByText('Post 2'));
      assert.ok(screen.getByText('Post 3'));

      // Offering should be interleaved (after 3rd post)
      // Check if offering is visible
      const headings = screen.getAllByRole('heading', { level: 3 });
      const hasOffering = headings.some(h => h.textContent.includes('Demand Letter'));
      assert.ok(hasOffering, 'Should contain Demand Letter offering');
    });
  });
});
