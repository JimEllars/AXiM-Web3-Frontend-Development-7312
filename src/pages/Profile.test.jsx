import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, vi } from 'vitest';
import assert from 'assert';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Profile from './Profile.jsx';
import React from 'react';
import * as AuthHook from '../hooks/useAximAuth';

// Use original useAximStore so Zustand can work as expected, but mock supabase if needed.
// Or we mock Zustand store directly properly.
import { useAximStore } from '../store/useAximStore';

vi.mock('../hooks/useAximAuth', () => ({
  useAximAuth: vi.fn()
}));

// We'll mock the Zustand store's initial state for tests
const originalUseAximStore = vi.importActual('../store/useAximStore');
vi.mock('../store/useAximStore', async () => {
  const actual = await vi.importActual('../store/useAximStore');
  return {
    ...actual,
    useAximStore: vi.fn((selector) => {
      // Mock basic state
      const state = {
        assets: [],
        tickets: [],
        clearStore: vi.fn(),
        vaultedArtifacts: [],
        userSession: null,
        isSessionLoading: false,
        isWeb3Authenticated: false,
        walletAddress: null
      };
      return selector(state);
    })
  };
});


describe('Profile Component Smoke Test', () => {

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders user profile section when logged in', () => {
    vi.spyOn(AuthHook, 'useAximAuth').mockReturnValue({ session: { user: { id: 'test-id', email: 'test@example.com' } }, user: { id: 'test-id', email: 'test@example.com' }, loading: false });

    render(
      <HelmetProvider>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </HelmetProvider>
    );

    assert.ok(screen.getAllByText(/Operator Profile|Standard System Profile/));
  });
});
