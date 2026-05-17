import 'global-jsdom/register';
import React from 'react';
import { describe, it, beforeEach, vi } from 'vitest';
import assert from 'assert';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import EarlyAccess from './EarlyAccess.jsx';

// Mock IntersectionObserver for framer-motion
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('EarlyAccess Component', () => {
  it('renders the header and form elements', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <EarlyAccess />
        </MemoryRouter>
      </HelmetProvider>
    );

    // Check header
    assert(screen.getAllByText(/Priority Intelligence/i).length > 0);

    // Check form
    const emailInputs = screen.getAllByPlaceholderText('operator@enterprise.com');
    assert(emailInputs.length > 0);
    assert.strictEqual(emailInputs[0].type, 'email');
    assert.strictEqual(emailInputs[0].required, true);

    const submitButtons = screen.getAllByRole('button', { name: /Subscribe to Updates/i });
    assert(submitButtons.length > 0);
  });

  it('handles form submission successfully', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <EarlyAccess />
        </MemoryRouter>
      </HelmetProvider>
    );

    const emailInputs = screen.getAllByPlaceholderText('operator@enterprise.com');
    const emailInput = emailInputs[0];
    const submitButtons = screen.getAllByRole('button', { name: /Subscribe to Updates/i });
    const submitButton = submitButtons[0];

    // Fill in the email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Submit form
    const form = emailInput.closest('form');
    fireEvent.submit(form);

    // Expect loading state
    assert(screen.getAllByText(/ENCRYPTING.../i).length > 0);

    // Expect success state
    await waitFor(() => {
        assert(screen.getAllByText(/Subscription Confirmed/i).length > 0);
    }, { timeout: 2000 });
  });
});
