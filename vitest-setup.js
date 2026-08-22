import { expect, vi } from 'vitest';
global.expect = expect;

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
