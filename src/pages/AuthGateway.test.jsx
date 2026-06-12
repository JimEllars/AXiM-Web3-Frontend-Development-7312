import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AuthGateway from './AuthGateway';
import { useAximAuth } from '../hooks/useAximAuth';

// Mock the auth hook
vi.mock('../hooks/useAximAuth', () => ({
  useAximAuth: vi.fn(),
}));

describe('AuthGateway Component', () => {
  it('renders correctly', () => {
    useAximAuth.mockReturnValue({ signIn: vi.fn(), signUp: vi.fn() });

    render(
      <HelmetProvider>
        <MemoryRouter>
          <AuthGateway />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getAllByText(/System/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Clearance/i).length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/operator@domain.com/i)).toBeTruthy();
  });
});
