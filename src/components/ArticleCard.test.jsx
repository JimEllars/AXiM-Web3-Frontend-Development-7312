import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, vi } from 'vitest';
import assert from 'assert';
import { render, screen, cleanup, act } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import ArticleCard from './ArticleCard.jsx';

describe('ArticleCard Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders basic info', () => {
    const article = {
        slug: 'test-slug',
        title: { rendered: 'Test Title' },
        excerpt: { rendered: 'Test Excerpt' },
        date: '2023-01-01T00:00:00'
    };
    render(
      <MemoryRouter>
        <ArticleCard article={article} />
      </MemoryRouter>
    );
    assert.ok(screen.getByText(/Test Title/));
  });

});
