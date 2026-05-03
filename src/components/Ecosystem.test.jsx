import 'global-jsdom/register';
import { test, describe, afterEach, before } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import Ecosystem from './Ecosystem.jsx';

describe('Ecosystem Component', () => {
  before(() => {
    // Mock IntersectionObserver for framer-motion
    global.IntersectionObserver = class IntersectionObserver {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  afterEach(() => {
    cleanup();
  });

  test('renders null successfully (quarantined)', () => {
    const { container } = render(<Ecosystem />);
    assert.strictEqual(container.firstChild, null);
  });
});
