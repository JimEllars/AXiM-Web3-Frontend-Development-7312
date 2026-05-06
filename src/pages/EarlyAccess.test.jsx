import 'global-jsdom/register';
import React from 'react';
import { describe, it, beforeEach, vi } from 'vitest';
import assert from 'assert';
import { render, screen, fireEvent } from '@testing-library/react';
import EarlyAccess from './EarlyAccess.jsx';

// Mock IntersectionObserver for framer-motion
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('EarlyAccess Component', () => {
  beforeEach(() => {
    // Mock alert
    global.alert = vi.fn();
  });

  it('renders the header and main content', () => {
    render(<EarlyAccess />);

    // Check main header
    assert(screen.getByText(/Unified/i));
    assert(screen.getAllByText(/Onboarding/i).length > 0);
    assert(screen.getByText(/Restricted Access Protocol/i));

    // Check features
    assert(screen.getByText(/Verified Identity/i));
    assert(screen.getByText(/Secure your operator profile/i));
    assert(screen.getByText(/Instant Allocation/i));
  });

  it('renders the waitlist form', () => {
    render(<EarlyAccess />);

    const emailInputs = screen.getAllByPlaceholderText('ENTER_EMAIL_ADDRESS');
    assert(emailInputs.length > 0);
    const emailInput = emailInputs[0];
    assert.strictEqual(emailInput.type, 'email');
    assert.strictEqual(emailInput.required, true);

    const submitButtons = screen.getAllByRole('button', { name: /Request Clearance/i });
    assert(submitButtons.length > 0);
    const submitButton = submitButtons[0];
    assert(submitButton);
  });

  it('calls alert on form submission', () => {
    render(<EarlyAccess />);

    const emailInputs = screen.getAllByPlaceholderText('ENTER_EMAIL_ADDRESS');
    const emailInput = emailInputs[0];
    const submitButtons = screen.getAllByRole('button', { name: /Request Clearance/i });
    const submitButton = submitButtons[0];

    // Fill in the email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Submit form (we can just click the button or fire submit on the form)
    // The alert is handled via onSubmit on the form
    const form = emailInput.closest('form');
    fireEvent.submit(form);

    assert.strictEqual(global.alert.mock.calls.length, 1);
    assert.strictEqual(global.alert.mock.calls[0][0], 'Thanks for joining the waitlist!');
  });
});
