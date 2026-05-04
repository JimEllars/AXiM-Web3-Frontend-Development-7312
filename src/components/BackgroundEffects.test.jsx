import 'global-jsdom/register';
import { test, describe, afterEach, mock } from 'node:test';
import assert from 'node:assert';
import { render, cleanup } from '@testing-library/react';
import React from 'react';
import BackgroundEffects from './BackgroundEffects.jsx';

describe('BackgroundEffects Component', () => {

  afterEach(() => {
    cleanup();
    mock.restoreAll();
  });

  test('renders container with correct classes', () => {
    render(<BackgroundEffects />);
    const container = document.querySelector('div.fixed.inset-0.pointer-events-none.z-0');
    assert.ok(container);
  });

  test('renders blueprint grid', () => {
    render(<BackgroundEffects />);
    const gridByStyle = Array.from(document.querySelectorAll('div')).find(div => div.style.backgroundImage && div.style.backgroundImage.includes('linear-gradient'));
    assert.ok(gridByStyle, 'Grid should be rendered');
  });

  test('renders purple glow', () => {
    render(<BackgroundEffects />);
    const glow = document.querySelector('.bg-axim-purple\\/5');
    assert.ok(glow, 'Purple glow should be rendered');
  });

  test('renders static noise texture', () => {
    render(<BackgroundEffects />);
    const noise = Array.from(document.querySelectorAll('div')).find(div => div.className.includes('mix-blend-overlay'));
    assert.ok(noise, 'Noise texture should be rendered');
  });
});
