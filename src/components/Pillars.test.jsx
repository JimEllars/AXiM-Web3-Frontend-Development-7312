import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import Pillars from './Pillars.jsx';

describe('Pillars Component', () => {
  beforeEach(() => {
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

  test('renders section headings', () => {
    render(<Pillars />);

    assert.ok(screen.getByText('The Full Stack'));
    assert.ok(screen.getByText('Cohesive Operational Ecosystem'));
  });

  test('renders pillar cards with titles and descriptions', () => {
    render(<Pillars />);

    // AXiM Built
    assert.ok(screen.getByText('AXiM Built'));
    assert.ok(screen.getByText(/Physical infrastructure for a connected world/));

    // AXiM Digital
    assert.ok(screen.getByText('AXiM Digital'));
    assert.ok(screen.getByText(/The unified data backbone/));

    // AXiM Intelligence
    assert.ok(screen.getByText('AXiM Intelligence'));
    assert.ok(screen.getByText(/The orchestrator/));
  });

  test('renders correct links with accurate hrefs', () => {
    render(<Pillars />);

    const builtLink = screen.getByRole('link', { name: /Physical Assets/i });
    assert.ok(builtLink);
    assert.strictEqual(builtLink.getAttribute('href'), 'https://axim.us.com/built/');

    const digitalLink = screen.getByRole('link', { name: /Data Layer/i });
    assert.ok(digitalLink);
    assert.strictEqual(digitalLink.getAttribute('href'), 'https://axim.us.com/digital/');

    const intelligenceLink = screen.getByRole('link', { name: /Autonomous Logic/i });
    assert.ok(intelligenceLink);
    assert.strictEqual(intelligenceLink.getAttribute('href'), 'https://axim.us.com/intelligence/');
  });
});
