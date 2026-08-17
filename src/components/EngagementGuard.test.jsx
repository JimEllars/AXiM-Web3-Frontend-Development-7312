import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EngagementGuard from './EngagementGuard';
import * as telemetry from '../lib/telemetry';

// Mock framer-motion's useScroll and useMotionValueEvent
vi.mock('framer-motion', () => ({
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useMotionValueEvent: vi.fn((value, event, callback) => {
    // Provide a way to manually trigger the callback for testing
    global.triggerScroll = callback;
  }),
}));

describe('EngagementGuard', () => {
  let logSpy;
  let flushSpy;

  beforeEach(() => {
    logSpy = vi.spyOn(telemetry, 'logTelemetry').mockImplementation(() => {});
    flushSpy = vi.spyOn(telemetry, 'flushTelemetryQueue').mockImplementation(() => {});
    vi.useFakeTimers();
    // Initialize triggerScroll
    global.triggerScroll = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete global.triggerScroll;
  });

  it('should render nothing (null)', () => {
    const { container } = render(
      <MemoryRouter>
        <EngagementGuard />
      </MemoryRouter>
    );
    expect(container.innerHTML).toBe('');
  });

  it('should log page_view on mount and page_unload on unmount', () => {
    const { unmount } = render(
      <MemoryRouter initialEntries={['/test']}>
        <EngagementGuard />
      </MemoryRouter>
    );

    expect(logSpy).toHaveBeenCalledWith('page_view', { route: '/test' });

    // Fast-forward time to simulate dwell
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    unmount();

    expect(logSpy).toHaveBeenCalledWith('page_unload', {
      route: '/test',
      dwell_time_ms: 1500
    });
  });

  it('should track scroll depth percentages', () => {
    render(
      <MemoryRouter initialEntries={['/test']}>
        <EngagementGuard />
      </MemoryRouter>
    );

    act(() => {
      global.triggerScroll(0.3); // Past 25%
    });
    expect(logSpy).toHaveBeenCalledWith('scroll_depth', { route: '/test', depth: '25%' });

    act(() => {
      global.triggerScroll(0.6); // Past 50%
    });
    expect(logSpy).toHaveBeenCalledWith('scroll_depth', { route: '/test', depth: '50%' });

    // Ensure 25% isn't logged again
    expect(logSpy.mock.calls.filter(call => call[0] === 'scroll_depth' && call[1].depth === '25%').length).toBe(1);
  });

  it('should track visibility changes', () => {
    render(
      <MemoryRouter initialEntries={['/test']}>
        <EngagementGuard />
      </MemoryRouter>
    );

    act(() => {
      // Mock visibilityState and dispatch event
      Object.defineProperty(document, 'visibilityState', {
        value: 'hidden',
        writable: true,
      });
      window.dispatchEvent(new Event('visibilitychange'));
    });

    expect(logSpy).toHaveBeenCalledWith('tab_hidden', expect.any(Object));

    act(() => {
      document.visibilityState = 'visible';
      window.dispatchEvent(new Event('visibilitychange'));
    });

    expect(logSpy).toHaveBeenCalledWith('tab_visible', expect.any(Object));
  });

  it('should track interaction heartbeats with throttle', () => {
    render(
      <MemoryRouter initialEntries={['/test']}>
        <EngagementGuard />
      </MemoryRouter>
    );

    act(() => {
      window.dispatchEvent(new Event('click'));
    });

    expect(logSpy).toHaveBeenCalledWith('user_interaction_heartbeat', { route: '/test' });

    // Subsequent immediate clicks should be throttled
    logSpy.mockClear();
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(logSpy).not.toHaveBeenCalled();

    // Advance past throttle window (30s)
    act(() => {
      vi.advanceTimersByTime(31000);
      window.dispatchEvent(new Event('keydown'));
    });
    expect(logSpy).toHaveBeenCalledWith('user_interaction_heartbeat', { route: '/test' });
  });
});
