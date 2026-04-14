import 'global-jsdom/register';
import { test, describe, afterEach, mock, beforeEach } from 'node:test';
import assert from 'node:assert';
import { render, screen, act, cleanup } from '@testing-library/react';
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
  });

  afterEach(() => {
    cleanup();
    mock.timers.reset();
  });

  test('Renders initial logs correctly', () => {
    render(<AximTerminal />);

    assert.ok(screen.getByText(/System_Logs \/\/ Live_Stream/i));
    assert.ok(screen.getByText(/> INITIALIZING_AXM_CORE\.\.\./));
    assert.ok(screen.getByText(/> AUTHENTICATING_UPLINK\.\.\./));
    assert.ok(screen.getByText(/> GRID_SYNC: SUCCESSFUL/));
    assert.ok(screen.getByText(/> LISTENING_FOR_PACKETS\.\.\./));

    const initialLogs = screen.getAllByText(/>/);
    assert.strictEqual(initialLogs.length, 4);
  });

  test('Adds new log entry after 3 seconds', () => {
    render(<AximTerminal />);

    const initialLogsCount = screen.getAllByText(/>/).length;
    assert.strictEqual(initialLogsCount, 4);

    act(() => {
      mock.timers.tick(3000);
    });

    const updatedLogsCount = screen.getAllByText(/>/).length;
    assert.strictEqual(updatedLogsCount, 5);
  });

  test('Limits log history to 13 items', () => {
    render(<AximTerminal />);

    act(() => {
      mock.timers.tick(30000);
    });

    const logsCount = screen.getAllByText(/>/).length;
    assert.strictEqual(logsCount, 13);
  });

  test('Auto-scrolls to bottom when logs update', () => {
    render(<AximTerminal />);

    const container = screen.getByText(/System_Logs \/\/ Live_Stream/i).parentElement;

    Object.defineProperty(container, 'scrollHeight', { value: 500, configurable: true });

    act(() => {
      mock.timers.tick(3000);
    });

    assert.strictEqual(container.scrollTop, 500);
  });
});
