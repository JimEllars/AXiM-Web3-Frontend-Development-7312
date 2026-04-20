import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, mock } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThirdwebProvider } from 'thirdweb/react';
import Profile from './Profile.jsx';

describe('Profile Component', () => {
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Mock fetch for the roll api key
    global.fetch = mock.fn(async () => {
      return {
        ok: true,
        json: async () => ({})
      };
    });
  });

  afterEach(() => {
    cleanup();
    mock.restoreAll();
  });

  const mockAuthHook = (mockData) => () => ({
    account: null,
    profile: null,
    loading: false,
    ...mockData
  });

  const mockStoreHook = (mockData) => () => ({
    userSession: null,
    isSessionLoading: false,
    ...mockData
  });

  const mockReadContractHook = (balanceData = 0n, yieldData = 0n) => (params) => {
    if (params && params.method && params.method.includes('balanceOf')) {
      return { data: balanceData, isLoading: false };
    }
    if (params && params.method && params.method.includes('calculateYield')) {
      return { data: yieldData, isLoading: false };
    }
    return { data: null, isLoading: false };
  };

  const mockActiveChainHook = (chain = { name: "Sepolia" }) => () => chain;

  const renderWithProviders = (ui) => {
    return render(
      <ThirdwebProvider>
        <QueryClientProvider client={queryClient}>
          {ui}
        </QueryClientProvider>
      </ThirdwebProvider>
    );
  };

  test('renders loading state when auth is initializing', () => {
    renderWithProviders(
      <Profile
        authHook={mockAuthHook({ loading: true })}
        storeHook={mockStoreHook()}
        readContractHook={mockReadContractHook()}
        activeChainHook={mockActiveChainHook()}
      />
    );
    assert.ok(screen.getByText('INITIALIZING_PROFILE...'));
  });

  test('renders "Identity Required" when no account is connected', () => {
    renderWithProviders(
      <Profile
        authHook={mockAuthHook({ account: null, loading: false })}
        storeHook={mockStoreHook()}
        readContractHook={mockReadContractHook()}
        activeChainHook={mockActiveChainHook()}
      />
    );
    assert.ok(screen.getByText('Identity Required'));
  });

  test('renders full dashboard when account is connected', () => {
    const account = { address: '0x1234567890abcdef1234567890abcdef12345678' };
    const profile = { clearance_level: 2 };

    renderWithProviders(
      <Profile
        authHook={mockAuthHook({ account, profile, loading: false })}
        storeHook={mockStoreHook()}
        readContractHook={mockReadContractHook(100n, 50n)}
        activeChainHook={mockActiveChainHook({ name: "Ethereum" })}
      />
    );

    assert.ok(screen.getByText('AXiM ID Dashboard'));
    assert.ok(screen.getByText('Active Network'));
    assert.ok(screen.getByText('ETHEREUM', { exact: false })); // case insensitivity and fuzzy matching

    // Check balance and yield are rendered correctly
    assert.ok(screen.getByText('100 AXM', { exact: false }));
    assert.ok(screen.getByText('50 AXM', { exact: false }));
  });

  test('handles claiming yield correctly', async () => {
    const account = { address: '0x123' };

    renderWithProviders(
      <Profile
        authHook={mockAuthHook({ account })}
        storeHook={mockStoreHook()}
        readContractHook={mockReadContractHook(10n, 50n)}
        activeChainHook={mockActiveChainHook()}
      />
    );

    const claimButton = screen.getAllByRole('button').find(el => el.textContent.includes('Claim Yield'));
    assert.strictEqual(claimButton.disabled, false);

    fireEvent.click(claimButton);

    await waitFor(() => {
      assert.ok(screen.getByText('Claimed'));
      assert.ok(screen.getByText('Yield Claimed Successfully'));
      assert.strictEqual(claimButton.disabled, true);
    });
  });

  test('renders "Roll API Key" correctly and handles it', async () => {
    const account = { address: '0x123' };
    const userSession = { is_partner: true, session_token: '123' };

    renderWithProviders(
      <Profile
        authHook={mockAuthHook({ account })}
        storeHook={mockStoreHook({ userSession })}
        readContractHook={mockReadContractHook(10n, 50n)}
        activeChainHook={mockActiveChainHook()}
      />
    );

    const rollButton = screen.getAllByRole('button').find(el => el.textContent.includes('Roll API Key'));
    assert.ok(rollButton);

    fireEvent.click(rollButton);

    assert.ok(screen.getByText('Rolling Key...'));

    await waitFor(() => {
      assert.strictEqual(global.fetch.mock.calls.length, 1);
      assert.ok(screen.getByText(/API Key successfully rolled/i));
    });
  });
});
