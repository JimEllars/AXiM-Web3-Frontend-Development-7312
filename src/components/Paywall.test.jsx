import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import React from 'react';
import Paywall from './Paywall.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('Paywall Component', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
  });

  afterEach(() => {
    cleanup();
  });

  test('renders children and allows click when web3Gate is false', () => {
    const handleClick = mock.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <Paywall
          price="4.00"
          productId="123"
          web3Gate={false}
          useActiveAccount={() => null}
          useReadContract={() => ({ data: 0n, isLoading: false })}
        >
          <button onClick={handleClick}>Click Me</button>
        </Paywall>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText('Click Me'));
    assert.strictEqual(handleClick.mock.callCount(), 1);
    assert.ok(!screen.queryByText('Protocol Locked'));
  });

  test('intercepts click and shows modal when web3Gate is true and no wallet connected', () => {
    const handleClick = mock.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <Paywall
          price="4.00"
          productId="123"
          web3Gate={true}
          useActiveAccount={() => null}
          useReadContract={() => ({ data: 0n, isLoading: false })}
          ConnectButton={() => <div data-testid="connect-button">Connect Wallet</div>}
        >
          <button onClick={handleClick}>Click Me</button>
        </Paywall>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText('Click Me'));
    assert.strictEqual(handleClick.mock.callCount(), 0);
    assert.ok(screen.getByText('Protocol Locked'));
    assert.ok(screen.getByText('Pay $4.00 USD'));
  });

  test('allows click when web3Gate is true and user has access token', () => {
    const handleClick = mock.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <Paywall
          price="4.00"
          productId="123"
          web3Gate={true}
          useActiveAccount={() => ({ address: '0x123' })}
          useReadContract={() => ({ data: 1n, isLoading: false })}
        >
          <button onClick={handleClick}>Click Me</button>
        </Paywall>
      </QueryClientProvider>
    );

    fireEvent.click(screen.getByText('Click Me'));
    assert.strictEqual(handleClick.mock.callCount(), 1);
    assert.ok(!screen.queryByText('Protocol Locked'));
  });
});
