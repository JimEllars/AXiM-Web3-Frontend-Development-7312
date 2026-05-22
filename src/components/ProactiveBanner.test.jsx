import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, vi } from 'vitest';
import assert from 'assert';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import React from 'react';
import ProactiveBanner from './ProactiveBanner.jsx';

describe('ProactiveBanner Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllTimers();
  });

  test('renders static content', () => {
    render(<ProactiveBanner />);

    assert.ok(screen.getByText(/Priority Intelligence\./i));
    assert.ok(screen.getByText(/Subscribe to receive strategic blueprints/i));
    assert.ok(screen.getByPlaceholderText('operator@enterprise.com'));
    assert.ok(screen.getByRole('button', { name: /Initialize Uplink/i }));
  });


  test('handles successful subscription with fake timers', async () => {
    // Mock fetch for success
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
      })
    );

    render(<ProactiveBanner />);

    const emailInput = screen.getByPlaceholderText('operator@enterprise.com');
    const submitButton = screen.getByRole('button', { name: /Initialize Uplink/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    await act(async () => {
        fireEvent.click(submitButton);
    });

    assert.ok(screen.getByText(/Comms Secured/i));
    assert.ok(screen.getByText(/Awaiting Transmission\./i));
  });

  test('does not submit if email is empty', () => {
      render(<ProactiveBanner />);
      const submitButton = screen.getByRole('button', { name: /Initialize Uplink/i });
      fireEvent.click(submitButton);
      assert.strictEqual(screen.queryByText(/Encrypting\.\.\./i), null);
  });
});
