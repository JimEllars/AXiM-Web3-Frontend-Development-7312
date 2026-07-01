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
    assert.ok(screen.getByText(/Work Smarter\./));

    // Check description paragraph
    assert.ok(screen.getByText(/Streamline your business operations with our suite of enterprise tools and expert consultation services./));

    // Check CTA buttons exist
    assert.ok(screen.getAllByText(/Explore Tools/)[0]);
    assert.ok(screen.getByText(/Consultation/));
  });

});
