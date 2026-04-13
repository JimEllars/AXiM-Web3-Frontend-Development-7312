import 'global-jsdom/register';
import { test, describe, afterEach, before } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import Deployment from './Deployment.jsx';

describe('Deployment Component', () => {
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

  test('renders main headings and labels', () => {
    render(<Deployment />);

    // Check main labels and headings
    assert.ok(screen.getByText('Operational Deployment'));
    assert.ok(screen.getByText('Physical & Virtual Performance'));
    assert.ok(screen.getByText('Bridging the gap between physical infrastructure and digital optimization at scale.'));
    assert.ok(screen.getByText('REF: AXM_DEPLOYMENT_MODEL_V4.2 // STATUS: ACTIVE'));
  });

  test('renders specific offerings with correct descriptions', () => {
    render(<Deployment />);

    // Solar & Smart Grids
    assert.ok(screen.getByText('AXiM Solar & Smart Grids'));
    assert.ok(screen.getByText('Utility-scale energy arrays and next-gen residential power designed for operational excellence.'));

    // Legal Infrastructure
    assert.ok(screen.getByText('Legal Infrastructure Automation'));
    assert.ok(screen.getByText('Generate professional demand letters in 12 minutes for $4.00. High-performance Ai fact-extraction with 97.4% precision.'));

    // Neural Media
    assert.ok(screen.getByText('Neural Media Processing'));
    assert.ok(screen.getByText('High-fidelity transcription and media indexing for complex communication logs and business intelligence.'));
  });

  test('renders correct links with accurate URLs', () => {
    render(<Deployment />);

    // Demand Letter link
    const demandLetterLink = screen.getByRole('link', { name: /Access Quick Demand Letter/i });
    assert.ok(demandLetterLink);
    assert.strictEqual(demandLetterLink.getAttribute('href'), 'https://quickdemandletter.com');

    // Roadmap link
    const roadmapLink = screen.getByRole('link', { name: /Download Strategic Roadmap/i });
    assert.ok(roadmapLink);
    assert.strictEqual(roadmapLink.getAttribute('href'), 'https://axim.us.com/solutions');
  });
});
