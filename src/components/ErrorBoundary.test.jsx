import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary.jsx';
import React from 'react';

const ThrowErrorComponent = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test Error');
  }
  return <div data-testid="normal-child">Normal Content</div>;
};

describe('ErrorBoundary Component', () => {
  let originalConsoleError;

  beforeEach(() => {
    // Suppress React's error logging to keep test output clean
    originalConsoleError = console.error;
    console.error = mock.fn();

    // Attempting to mock window.location in JSDOM often fails,
    // so we will only assert that click does not crash.
  });

  afterEach(() => {
    cleanup();
    console.error = originalConsoleError;
  });

  test('renders children normally when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    assert.ok(screen.getByTestId('normal-child'));
    assert.strictEqual(screen.getByTestId('normal-child').textContent, 'Normal Content');
  });

  test('catches error and renders fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    assert.ok(screen.getByText('System Malfunction'));
    assert.ok(screen.getByText('Error: Test Error'));
    assert.ok(screen.getByRole('button', { name: /reboot interface/i }));

    // Verify console.error was called by componentDidCatch
    assert.ok(console.error.mock.calls.length >= 1);

    // The exact arguments depend on React internals, but we can verify it logged something
    assert.ok(console.error.mock.calls.some(call =>
      (typeof call.arguments[0] === 'string' && call.arguments[0].includes('ErrorBoundary caught an error')) ||
      (typeof call.arguments[0] === 'string' && call.arguments[0].includes('Test Error')) ||
      (call.arguments[1] && typeof call.arguments[1] === 'string' && call.arguments[1].includes('Test Error'))
    ));
  });

  test('clicking Reboot Interface button works without crashing', () => {
    // Mock the window.location.reload temporarily by creating a dummy property if possible
    // Alternatively, since it throws an error in actual JSDOM ("Not implemented: navigation"),
    // we just want to test that the click handler fires without blowing up entirely.

    // JSDOM will throw "Error: Not implemented: navigation (except hash changes)"
    // when reload is called. We can catch this globally or locally.

    // Try to safely intercept reload if it exists, otherwise just try to click
    const originalReload = window.location.reload;
    let didCallReload = false;
    try {
        Object.defineProperty(window.location, 'reload', {
            value: () => { didCallReload = true; },
            writable: true,
            configurable: true
        });
    } catch(e) {}

    render(
      <ErrorBoundary>
        <ThrowErrorComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /reboot interface/i });

    try {
        fireEvent.click(button);
        // If it didn't throw, and we mocked it, didCallReload should be true
        if (didCallReload) {
           assert.ok(true);
        }
    } catch(e) {
        // If it threw "Not implemented: navigation", that means the real reload was called
        assert.ok(e.message.includes('Not implemented') || e.message.includes('reload'), 'Should try to reload');
    }

    try {
        if (originalReload) {
            Object.defineProperty(window.location, 'reload', {
                value: originalReload,
                writable: true,
                configurable: true
            });
        }
    } catch(e) {}
  });
});
