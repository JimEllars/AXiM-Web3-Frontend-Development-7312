import 'global-jsdom/register';
import { test, describe, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock dependencies
vi.mock('../hooks/useAximAuth', () => ({
  useAximAuth: vi.fn()
}));
vi.mock('../store/useAximStore', () => ({
  useAximStore: vi.fn()
}));
vi.mock('../lib/telemetry', () => ({
  logTelemetry: vi.fn()
}));

const { useAximAuth } = await import('../hooks/useAximAuth');
const { useAximStore } = await import('../store/useAximStore');
const ProtectedRoute = (await import('./ProtectedRoute.jsx')).default;

describe('ProtectedRoute Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test('renders skeleton loader when isHydrating/isLoading is true', () => {
    useAximAuth.mockReturnValue({ session: null, isLoading: true, isHydrating: true });
    useAximStore.mockReturnValue(false); // isWeb3Authenticated

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute><div data-testid="content">Content</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Validating Clearance Matrix...')).toBeTruthy();
    expect(screen.queryByTestId('content')).toBeNull();
  });

  test('renders skeleton loader when only isHydrating is true', () => {
    useAximAuth.mockReturnValue({ session: null, isLoading: false, isHydrating: true });
    useAximStore.mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute><div data-testid="content">Content</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Validating Clearance Matrix...')).toBeTruthy();
  });
});
