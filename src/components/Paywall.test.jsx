import 'global-jsdom/register';
import { test, describe, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import Paywall from './Paywall';

vi.mock('../lib/telemetry', () => ({
  logTelemetry: vi.fn()
}));

const { logTelemetry } = await import('../lib/telemetry');

describe('Paywall Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test('renders the paywall correctly', () => {
    render(
        <Paywall price={49.99} productId="test-product" web3Gate={true}>
            <div data-testid="content">Protected Content</div>
        </Paywall>
    );

    expect(screen.getByText('Restricted Access')).toBeTruthy();
    expect(screen.getByText('$49.99')).toBeTruthy();
    expect(screen.getByText('Pay with Stripe (Test)')).toBeTruthy();
    expect(screen.getByText('Connect Wallet to Bypass')).toBeTruthy();
    expect(screen.queryByTestId('content')).toBeNull();
  });

  test('unlocks content when bypassed', () => {
    render(
        <Paywall price={49.99} productId="test-product" web3Gate={true}>
            <div data-testid="content">Protected Content</div>
        </Paywall>
    );

    fireEvent.click(screen.getByText('Pay with Stripe (Test)'));
    expect(screen.getByTestId('content')).toBeTruthy();
    expect(logTelemetry).toHaveBeenCalledWith('paywall_bypassed_test', { method: 'stripe', product: 'test-product' });
  });
});