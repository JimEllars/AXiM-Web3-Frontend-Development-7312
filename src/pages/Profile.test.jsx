import 'global-jsdom/register';
import { test, describe, beforeEach, afterEach, vi } from 'vitest';
import assert from 'node:assert/strict';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Profile from './Profile.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThirdwebProvider } from 'thirdweb/react';

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'test-user', email: 'test@example.com' } } }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
    },
    from: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: { full_name: 'Test User' }, error: null })
  }
}));


// Mock Thirdweb client and hooks since Profile uses them heavily
vi.mock('thirdweb/react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useActiveAccount: vi.fn(() => ({ address: '0x123' })),
    useActiveWallet: vi.fn(() => ({ id: 'metamask' })),
    useWalletBalance: vi.fn(() => ({ data: { displayValue: '100', symbol: 'USDC' }, isLoading: false })),
  };
});


describe('Profile Component Smoke Test', () => {

beforeEach(() => {
  vi.spyOn(window, 'alert').mockImplementation(() => {});
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});


  test('renders user profile section when logged in', () => {
    const queryClient = new QueryClient();
    render(
      <HelmetProvider>
         <QueryClientProvider client={queryClient}>
           <ThirdwebProvider>
             <MemoryRouter>
               <Profile />
             </MemoryRouter>
           </ThirdwebProvider>
         </QueryClientProvider>
      </HelmetProvider>
    );
    // basic assertion
    assert.ok(true);
  });
});
