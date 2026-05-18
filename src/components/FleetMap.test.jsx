import 'global-jsdom/register';
import React from 'react';
import { render, screen } from '@testing-library/react';
import {  test, mock, describe, afterEach, beforeEach , vi } from 'vitest';
import assert from 'assert';
import FleetMap from './FleetMap';

describe('FleetMap Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    global.window.HTMLCanvasElement.prototype.getContext = () => ({
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      fillText: vi.fn(),
    });
    global.requestAnimationFrame = vi.fn();
    global.cancelAnimationFrame = vi.fn();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
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
