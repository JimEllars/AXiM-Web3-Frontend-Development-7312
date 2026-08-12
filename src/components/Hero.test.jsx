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
  const stripProps = (props) => {
    const { initial, whileInView, viewport, variants, onViewportEnter, transition, animate, exit, layout, ...rest } = props;
    return rest;
  };
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }) => <div {...stripProps(props)}>{children}</div>,
      section: ({ children, ...props }) => <section {...stripProps(props)}>{children}</section>,
      p: ({ children, ...props }) => <p {...stripProps(props)}>{children}</p>,
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
    assert.ok(screen.getByText(/Accelerate Your Personal, Professional, and Business Systems with the AXiM Development Advantage./));

    // Check CTA buttons exist
    assert.ok(screen.getAllByText(/Explore Tools/)[0]);
    assert.ok(screen.getByText(/Consultation/));
  });

});
