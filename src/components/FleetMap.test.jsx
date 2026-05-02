import 'global-jsdom/register';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { test, mock, describe, afterEach, beforeEach } from 'node:test';
import assert from 'node:assert';
import FleetMap from './FleetMap';

describe('FleetMap Component', () => {
  beforeEach(() => {
    mock.timers.enable({ apis: ['setInterval'] });
    global.window.HTMLCanvasElement.prototype.getContext = () => ({
      clearRect: mock.fn(),
      beginPath: mock.fn(),
      moveTo: mock.fn(),
      lineTo: mock.fn(),
      stroke: mock.fn(),
      arc: mock.fn(),
      fill: mock.fn(),
      fillText: mock.fn(),
    });
    global.requestAnimationFrame = mock.fn();
    global.cancelAnimationFrame = mock.fn();
  });

  afterEach(() => {
    mock.timers.reset();
    mock.restoreAll();
    delete global.window.HTMLCanvasElement.prototype.getContext;
    delete global.requestAnimationFrame;
    delete global.cancelAnimationFrame;
  });

  test('renders svg element with expected classes', () => {
    render(<FleetMap />);
    const svg = document.querySelector('svg');
    assert.ok(svg);


    assert.ok(svg.className.baseVal.includes('border-axim-purple/30'));
  });
});
