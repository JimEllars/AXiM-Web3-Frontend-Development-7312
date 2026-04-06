import 'global-jsdom/register';
import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert';
import { render, cleanup } from '@testing-library/react';
import NetworkTopology from './NetworkTopology.jsx';

describe('NetworkTopology Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('Renders correct number of nodes and lines', () => {
    const { container } = render(<NetworkTopology />);

    // There are 5 nodes in the static NODES array
    const nodes = container.querySelectorAll('circle');
    assert.strictEqual(nodes.length, 5, 'Should render 5 nodes');

    // There are 6 connections in the static CONNECTIONS array
    const lines = container.querySelectorAll('line');
    assert.strictEqual(lines.length, 6, 'Should render 6 connection lines');

    // Verify first line coordinates (connection between node 1 and 2)
    // Node 1: {x: 50, y: 20}
    // Node 2: {x: 20, y: 50}
    const firstLine = lines[0];
    assert.strictEqual(firstLine.getAttribute('x1'), '50');
    assert.strictEqual(firstLine.getAttribute('y1'), '20');
    assert.strictEqual(firstLine.getAttribute('x2'), '20');
    assert.strictEqual(firstLine.getAttribute('y2'), '50');
  });

  test('Renders status and latency text', () => {
    const { getByText } = render(<NetworkTopology />);
    assert.ok(getByText(/UPLINK_SYNCED/i));
    assert.ok(getByText(/Latency: 14ms/i));
  });
});
