import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, vi } from 'vitest';
import assert from 'assert';

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Profile from './Profile.jsx';
import React from 'react';
import * as AuthHook from '../hooks/useAximAuth';
import * as StoreHook from '../store/useAximStore';

vi.mock('../hooks/useAximAuth', () => ({
  useAximAuth: vi.fn()
}));
vi.mock('../store/useAximStore', () => ({
  useAximStore: vi.fn()
}));

describe('Profile Component Smoke Test', () => {


  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders loading state without crashing', () => {
    vi.spyOn(AuthHook, 'useAximAuth').mockReturnValue({ session: null, profile: null, loading: true });
    vi.spyOn(StoreHook, 'useAximStore').mockReturnValue({ userSession: null, isSessionLoading: true });

    render(
      <HelmetProvider>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </HelmetProvider>
    );

    assert.ok(screen.getByText(/INITIALIZING_PROFILE.../));
  });

  test('renders user profile section when logged in', () => {
    vi.spyOn(AuthHook, 'useAximAuth').mockReturnValue({ session: { user: { id: 'test-id', email: 'test@example.com' } }, profile: null, loading: false });
    vi.spyOn(StoreHook, 'useAximStore').mockReturnValue({ userSession: null, isSessionLoading: false });

    render(
      <HelmetProvider>
        <MemoryRouter>
          <Profile />
        </MemoryRouter>
      </HelmetProvider>
    );

    assert.ok(screen.getAllByText(/Operator/));
    assert.ok(screen.getAllByText(/test@example.com/));
  });
});
