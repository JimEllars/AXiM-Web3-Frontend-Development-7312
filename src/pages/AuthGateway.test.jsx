/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThirdwebProvider } from 'thirdweb/react';
import AuthGateway from './AuthGateway';
import { useAximAuth } from '../hooks/useAximAuth';

// Mock the auth hook
vi.mock('../hooks/useAximAuth', () => ({
  useAximAuth: vi.fn(),
}));

describe('AuthGateway Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders correctly', async () => {
    useAximAuth.mockReturnValue({ signIn: vi.fn(), signUp: vi.fn() });

    render(
      <ThirdwebProvider>
        <HelmetProvider>
          <MemoryRouter>
            <AuthGateway />
          </MemoryRouter>
        </HelmetProvider>
      </ThirdwebProvider>
    );

    // Fast forward the 800ms hydration timer
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getAllByText(/System/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Clearance/i).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/operator@domain.com/i)).toBeTruthy();
  });
});
