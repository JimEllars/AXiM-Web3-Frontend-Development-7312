import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup, act } from '@testing-library/react';
import React from 'react';
import TelemetryBar from './TelemetryBar.jsx';

describe('TelemetryBar Component', () => {
  beforeEach(() => {
    mock.timers.enable({ apis: ['setInterval'] });
  });

  afterEach(() => {
    cleanup();
    mock.timers.reset();
  });

  test('Renders correct label and initial value', () => {
    render(<TelemetryBar label="CPU Load" color="axim-teal" initialValue={45} />);

    assert.ok(screen.getByText('CPU Load'));
    assert.ok(screen.getByText('45%'));
  });

  test('Updates value periodically', () => {
    const originalRandom = Math.random;
    try {
      Math.random = () => 0.9; // next diff is +2

      render(<TelemetryBar label="CPU Load" color="axim-teal" initialValue={45} />);

      assert.ok(screen.getByText('45%'));

      act(() => {
        mock.timers.tick(2000);
      });

      assert.ok(screen.getByText('47%'));

      act(() => {
        mock.timers.tick(2000);
      });

      assert.ok(screen.getByText('49%'));
    } finally {
      Math.random = originalRandom;
    }
  });

  test('Bounds the value between 0 and 100', () => {
    const originalRandom = Math.random;
    try {
      // Test upper bound (100)
      Math.random = () => 0.9; // diff = +2
      const { unmount } = render(<TelemetryBar label="High Load" color="axim-gold" initialValue={99} />);

      act(() => {
        mock.timers.tick(2000);
      });

      // 99 + 2 = 101, should cap at 100
      assert.ok(screen.getByText('100%'));

      unmount();

      // Test lower bound (0)
      Math.random = () => 0.1; // diff = Math.floor(0.1 * 5) - 2 = 0 - 2 = -2
      render(<TelemetryBar label="Low Load" color="axim-green" initialValue={1} />);

      act(() => {
        mock.timers.tick(2000);
      });

      // 1 - 2 = -1, should cap at 0
      assert.ok(screen.getByText('0%'));
    } finally {
      Math.random = originalRandom;
    }
  });
});
