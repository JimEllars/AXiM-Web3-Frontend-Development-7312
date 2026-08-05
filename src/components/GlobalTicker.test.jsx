import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import GlobalTicker from './GlobalTicker';
import { logTelemetry } from '../lib/telemetry';
import { useAximStore } from '../store/useAximStore';

// Mock telemetry dependency
vi.mock('../lib/telemetry', () => ({
  logTelemetry: vi.fn(),
}));

describe('GlobalTicker Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset store state to default unauthenticated state
    useAximStore.setState({
      isWeb3Authenticated: false,
      walletAddress: null,
    });
  });

  it('renders web3 badge correctly when authenticated', () => {
    useAximStore.setState({
      walletAddress: '0x1234567890abcdef',
      isWeb3Authenticated: true,
    });

    render(<GlobalTicker />);

    const elements = screen.queryAllByText(/\[NODE_HEALTH: ARBITRUM_RPC_100%_UPTIME\]/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('does not render web3 badge when not authenticated', () => {
    useAximStore.setState({
      walletAddress: null,
      isWeb3Authenticated: false,
    });

    render(<GlobalTicker />);

    const elements = screen.queryAllByText(/\[NODE_HEALTH: ARBITRUM_RPC_100%_UPTIME\]/i);
    expect(elements.length).toBe(0);
  });

  it('dispatches telemetry on pause and resume', () => {
    useAximStore.setState({
      walletAddress: null,
      isWeb3Authenticated: false,
    });

    const { container } = render(<GlobalTicker />);

    const marqueeContainer = container.querySelector('.opacity-80.hover\\:opacity-100');
    expect(marqueeContainer).toBeTruthy();

    fireEvent.mouseEnter(marqueeContainer);
    expect(logTelemetry).toHaveBeenCalledWith('ticker_stream_paused', expect.objectContaining({
      timestamp: expect.any(Number)
    }));

    fireEvent.mouseLeave(marqueeContainer);
    expect(logTelemetry).toHaveBeenCalledWith('ticker_stream_resumed', expect.objectContaining({
      timestamp: expect.any(Number)
    }));
  });
});
