import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, vi } from 'vitest';
import assert from 'assert';
import { render, screen, cleanup, act } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Hero from './Hero.jsx';

// Mock framer-motion to skip animations
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
  };
});

describe('Hero Component', () => {
  beforeEach(() => {

  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  test('renders main headings and static content', () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>
    );

    // Check main title
    assert.ok(screen.getByText(/Work/));
    assert.ok(screen.getAllByText(/Smarter/)[0]);

    // Check description paragraph
    assert.ok(screen.getByText(/Partner Ecosystem, AXiM Apps & Tools, & Learning Systems/));

    // Check CTA buttons exist
    assert.ok(screen.getAllByText(/AXiM Apps & Tools/)[0]);
    assert.ok(screen.getByText(/Explore Partners/));
  });

});
