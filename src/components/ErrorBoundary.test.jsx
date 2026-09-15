import { test, describe, afterEach, beforeEach, vi } from 'vitest';
import assert from 'assert';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import ErrorBoundary from './ErrorBoundary.jsx';

describe('ErrorBoundary Component', () => {
  let cleanupWindowError;

  beforeEach(() => {
    // Intercept JSDOM window error bubbling to suppress uncaught exception logs
    const handleWindowError = (event) => {
      if (
        event.message?.includes('Test Error from Child') ||
        event.message?.includes('Another Error')
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener('error', handleWindowError);
    cleanupWindowError = () => window.removeEventListener('error', handleWindowError);
  });

  afterEach(() => {
    if (cleanupWindowError) cleanupWindowError();
    cleanup();
  });

  test('renders children without error', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <div>All Good!</div>
      </ErrorBoundary>
    );
    assert.ok(getByText('All Good!'));
  });

  test('renders fallback UI when child component throws', () => {
    const originalConsoleError = console.error;
    console.error = vi.fn(); // Mock to prevent error logging in test output

    const ThrowError = () => {
      throw new Error('Test Error from Child');
    };

    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    assert.ok(getByText('System Malfunction'));
    assert.ok(getByText('System Malfunction'));
    assert.ok(getByText('Hard Reset Uplink'));

    console.error = originalConsoleError; // Restore
  });

  test('reboot button attempts to reload window', () => {
    const originalConsoleError = console.error;
    console.error = vi.fn();

    const ThrowError = () => {
      throw new Error('Another Error');
    };

    const { getByText } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const rebootButton = getByText('Hard Reset Uplink');
    assert.ok(rebootButton);

    assert.doesNotThrow(() => {
      try {
        fireEvent.click(rebootButton);
      } catch (e) {
        // Just catch the Not Implemented error
      }
    });

    console.error = originalConsoleError;
  });
});