import 'global-jsdom/register';
import { test, describe, afterEach, mock, beforeEach } from 'node:test';
import assert from 'node:assert';
import { render, screen, act, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import AximTerminal from './AximTerminal.jsx';

// Mock IntersectionObserver for framer-motion
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('AximTerminal Component', () => {
  beforeEach(() => {
    mock.timers.enable({ apis: ['setInterval', 'Date'] });
    global.fetch = mock.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ reply: "Mocked Reply" })
    }));
  });

  afterEach(() => {
    cleanup();
    mock.timers.reset();
  });

  test('Renders toggle button initially', () => {
    render(<AximTerminal />);

    assert.ok(screen.getByText(/Onyx Terminal/i));
  });

  test('Opens terminal when button clicked', () => {
    render(<AximTerminal />);

    const button = screen.getByText(/Onyx Terminal/i);
    fireEvent.click(button);

    assert.ok(screen.getByText(/INITIALIZING_ONYX_BRIDGE/i));
    assert.ok(screen.getByPlaceholderText(/Enter command/i));
  });

});
