import 'global-jsdom/register';

global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

import { test, describe, afterEach, beforeEach, vi } from 'vitest';

vi.mock('../hooks/useAximAuth', () => ({
  useAximAuth: () => ({
    user: null,
    loading: false
  })
}));

import assert from 'assert';
import { render, screen, cleanup, act } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('Header Component', () => {

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

  test('renders logo with correct sizing classes', () => {
    render(
      <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Header />
          </MemoryRouter>
      </QueryClientProvider>
    );
    const logoImg = screen.getByAltText('AXiM Development');
    assert.ok(logoImg.className.includes('h-[55px]'));
    assert.ok(logoImg.className.includes('md:h-[68px]'));
  });

});
