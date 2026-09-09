import 'global-jsdom/register';

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

import { test, describe, afterEach, beforeEach, vi } from 'vitest';
import assert from 'assert';
import { render, screen, cleanup, act } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import CategoryArticleFeed from './CategoryArticleFeed.jsx';

describe('CategoryArticleFeed Component', () => {

beforeEach(() => {
  window.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

  afterEach(() => {
    cleanup();
  });

  test('renders section title correctly', () => {
    render(
      <MemoryRouter>
        <CategoryArticleFeed categorySlug="business" sectionTitle="Test Business Title" />
      </MemoryRouter>
    );
    assert.ok(screen.getByText(/Test Business Title/));
  });

});
