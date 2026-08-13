import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Games from './Games';
import { useAximStore } from '../store/useAximStore';

expect.extend(matchers);

describe('Games Hub UI', () => {
  beforeEach(() => {
    // Reset the store state before each test
    useAximStore.setState({
      isWeb3Authenticated: false,
      walletAddress: null,
    });
  });

  it('renders Daily Word Cipher, Cyber Runner, and Neon Chess games', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <Games />
        </MemoryRouter>
      </HelmetProvider>
    );

    expect(screen.getByText(/Daily Word Cipher/i)).toBeInTheDocument();
    expect(screen.getByText(/Cyber Runner/i)).toBeInTheDocument();
    expect(screen.getByText(/Neon Chess/i)).toBeInTheDocument();
  });

  it('does NOT display [ON_CHAIN_SYNC: ACTIVE] when isWeb3Authenticated is false', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <Games />
        </MemoryRouter>
      </HelmetProvider>
    );

    const onChainSyncBadge = screen.queryAllByText(/\[ON_CHAIN_SYNC: ACTIVE\]/i);
    expect(onChainSyncBadge).toHaveLength(0);
  });

  it('displays [ON_CHAIN_SYNC: ACTIVE] when isWeb3Authenticated is true', () => {
    useAximStore.setState({
      isWeb3Authenticated: true,
      walletAddress: '0x123',
    });

    render(
      <HelmetProvider>
        <MemoryRouter>
          <Games />
        </MemoryRouter>
      </HelmetProvider>
    );

    const onChainSyncBadge = screen.getAllByText(/\[ON_CHAIN_SYNC: ACTIVE\]/i);
    expect(onChainSyncBadge.length).toBeGreaterThan(0);
  });
});
