import React from 'react';
import { expect, vi } from 'vitest';
global.expect = expect;
window.scrollTo = vi.fn();

// Mock IntersectionObserver globally
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock crypto securely for jsdom
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => Math.random().toString(36).substring(2)
  }
});

// Mock supabase for tests
vi.mock('./src/lib/supabase.js', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(),
      select: vi.fn()
    }))
  },
  isSupabaseConfigured: true
}));

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock Turnstile
vi.mock('@marsidev/react-turnstile', () => {
  const MockTurnstile = ({ onSuccess, ...props }) => {
    React.useEffect(() => {
      if (onSuccess) onSuccess('mock-turnstile-token');
    }, [onSuccess]);
    return React.createElement('div', {
      'data-testid': 'mock-turnstile',
      ...props
    });
  };
  return {
    __esModule: true,
    default: MockTurnstile,
    Turnstile: MockTurnstile,
  };
});

Object.defineProperty(window, 'turnstile', {
  value: {
    render: vi.fn(),
    reset: vi.fn(),
    remove: vi.fn(),
    getResponse: vi.fn(() => 'mock-token')
  },
  writable: true
});
