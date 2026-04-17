import 'global-jsdom/register';
import { test, describe, afterEach, before } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import Ecosystem from './Ecosystem.jsx';
import { coreLinks } from '../data/companyOfferings.js';

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

  test('renders the section title', () => {
    render(<Ecosystem />);
    const title = screen.getByText('The AXiM Ecosystem');
    assert.ok(title);
  });

  test('renders core links data', () => {
    render(<Ecosystem />);
    for (const link of coreLinks) {
      const linkTitle = screen.getByText(link.title);
      assert.ok(linkTitle);

      const linkDesc = screen.getByText(link.desc);
      assert.ok(linkDesc);

      const elements = screen.getAllByRole('link', { name: /Open Catalog/i });
      const hrefs = elements.map(e => e.getAttribute('href'));
      assert.ok(hrefs.includes(link.externalUrl));
    }
  });
});
