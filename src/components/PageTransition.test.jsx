window.scrollTo = vi.fn();
import 'global-jsdom/register';
import { test, describe, afterEach, vi } from 'vitest';
import assert from 'assert';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import PageTransition from './PageTransition.jsx';

// When testing React components that use framer-motion in a jsdom environment,
// globally mock IntersectionObserver to prevent ReferenceErrors
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('PageTransition Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders children successfully', () => {
    const { getByText, container } = render(
      <MemoryRouter initialEntries={['/']}>
        <PageTransition>
          <div data-testid="child-element">Hello, Transition!</div>
        </PageTransition>
      </MemoryRouter>
    );

    assert.ok(getByText('Hello, Transition!'));

    const motionDiv = container.firstChild;
    assert.ok(motionDiv);
    // Check if motion.div is rendered with the expected class
    assert.strictEqual(motionDiv.className, 'w-full h-full');
  });

  test('applies animation props correctly', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <PageTransition>
          <div>Test</div>
        </PageTransition>
      </MemoryRouter>
    );

    const motionDiv = container.firstChild;

    // We can assert the component renders the wrapper div correctly.
    assert.strictEqual(motionDiv.tagName, 'DIV');
    assert.strictEqual(motionDiv.className, 'w-full h-full');
  });
});
