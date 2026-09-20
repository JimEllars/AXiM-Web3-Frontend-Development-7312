vi.mock('../lib/supabase', () => ({ supabase: { channel: vi.fn(() => ({ on: vi.fn().mockReturnThis(), subscribe: vi.fn() })), removeChannel: vi.fn() }, isSupabaseConfigured: true }));
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import TelemetryBar from './TelemetryBar';
import { useAximStore } from '../store/useAximStore';
import React from 'react';

// Mock matchMedia
window.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

describe('TelemetryBar Component', () => {
  afterEach(() => { cleanup(); });
  beforeEach(() => {
    vi.clearAllMocks();
    useAximStore.setState({
      telemetryQueue: [],
      telemetryCollection: [],
      isWeb3Authenticated: false
    });
    // mock global fetch
    global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({'cf-ray': '1234-IAD'})
    }));
  });

  it('renders normal online state with RTT and queue size', async () => {
    const { unmount } = render(<TelemetryBar label="System Status" color="axim-gold" initialValue={100} />);

    // Test the text content
    await waitFor(() => {
        expect(screen.getAllByText((content, element) => content.includes('Global Latency:')).length).toBeGreaterThan(0);
        expect(screen.getAllByText((content, element) => content.includes('QUEUE: 0 EVENTS')).length).toBeGreaterThan(0);
        expect(screen.getAllByText((content, element) => content.includes('CONNECTED')).length).toBeGreaterThan(0);
    });
  });

  it('renders buffering offline state when fetch fails', async () => {
    global.fetch.mockRejectedValue(new Error('Network offline'));
    useAximStore.setState({ telemetryQueue: [{ id: 1, type: 'test' }] });

    const { unmount } = render(<TelemetryBar label="System Status" color="axim-gold" initialValue={100} />);

    await waitFor(() => {
        expect(screen.getAllByText((content, element) => content.includes('QUEUE: 1 EVENTS')).length).toBeGreaterThan(0);
        expect(screen.getAllByText((content, element) => content.includes('BUFFERING OFFLINE')).length).toBeGreaterThan(0);
    });
  });

  it('displays active telemetry node if web3 authenticated', async () => {
      useAximStore.setState({ isWeb3Authenticated: true });

      const { unmount } = render(<TelemetryBar label="System Status" color="axim-gold" initialValue={100} />);

      await waitFor(() => {
          expect(screen.getAllByText((content, element) => content.includes('TELEMETRY_NODE: ARBITRUM_EDGE_ACTIVE')).length).toBeGreaterThan(0);
      });
  });
});
