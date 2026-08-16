import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Tech from './Tech';

// Mock the Zustand store
vi.mock('../store/useAximStore.js', () => ({
  useAximStore: vi.fn((selector) => {
    return selector({
      isWeb3Authenticated: true,
      walletAddress: '0x123',
    });
  }),
}));

describe('Tech Hub Page', () => {
  it('renders successfully', () => {
    render(
      <MemoryRouter>
        <HelmetProvider>
          <Tech />
        </HelmetProvider>
      </MemoryRouter>
    );

    // Verify Hero Section
    expect(screen.getByText(/Engineering the/i)).toBeDefined();
    expect(screen.getByText(/Technical Backbone/i)).toBeDefined();

    // Verify Web3 Badge
    expect(screen.getAllByText(/\[TECH_NODE: INFRASTRUCTURE_BACKBONE_ACTIVE\]/i).length).toBeGreaterThan(0);

    // Verify Sections
    expect(screen.getByText(/Enterprise Applications & Infrastructure/i)).toBeDefined();
    expect(screen.getByText(/Autonomous AI & Stream Systems/i)).toBeDefined();
    expect(screen.getByText(/Games & Cognitive Interactive Engine/i)).toBeDefined();

    // Verify Games Arcade Link
    expect(screen.getByText(/Explore the Complete AXiM Games Arcade/i)).toBeDefined();
    const enterArcadeLinks = screen.getAllByRole('link', { name: /Enter Arcade/i });
    expect(enterArcadeLinks.length).toBeGreaterThan(0);
    expect(enterArcadeLinks[0].getAttribute('href')).toBe('/games');
  });
});
