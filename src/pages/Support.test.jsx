import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Support from './Support.jsx';

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

vi.mock('../lib/telemetry', () => ({
  logTelemetry: vi.fn(),
  trackEvent: vi.fn(),
}));

describe('Support Component', () => {
  it('renders successfully', () => {
    const { container } = render(
      <HelmetProvider>
        <BrowserRouter>
          <Support />
        </BrowserRouter>
      </HelmetProvider>
    );

    expect(screen.getByText('System')).toBeTruthy();
  });

  it('validates and submits form correctly', async () => {
    // Setup mock fetch
    global.fetch = vi.fn().mockResolvedValue({ ok: true });

    render(
      <HelmetProvider>
        <BrowserRouter>
          <Support />
        </BrowserRouter>
      </HelmetProvider>
    );

    const nameInput = screen.getAllByPlaceholderText('John Doe')[0];
    const emailInput = screen.getAllByPlaceholderText('email@company.com')[0];
    const subjectInput = screen.getAllByPlaceholderText('Brief description of your issue')[0];
    const issueInput = screen.getAllByPlaceholderText('How can we help you today?')[0];
    const submitBtn = screen.getAllByRole('button', { name: /send message/i })[0];

    // Try to submit with short name
    React.act(() => {
      nameInput.value = 'A';
      nameInput.dispatchEvent(new Event('change', { bubbles: true }));
      submitBtn.click();
    });

    // Form needs valid values to pass
    React.act(() => {
      nameInput.value = 'Test User';
      nameInput.dispatchEvent(new Event('change', { bubbles: true }));
      emailInput.value = 'test@example.com';
      emailInput.dispatchEvent(new Event('change', { bubbles: true }));
      subjectInput.value = 'A valid subject';
      subjectInput.dispatchEvent(new Event('change', { bubbles: true }));
      issueInput.value = 'A valid issue description that is longer than 20 characters.';
      issueInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    await React.act(async () => {
      submitBtn.click();
    });

    expect(global.fetch).toHaveBeenCalledWith('https://core.axim.us.com/api/v1/support/ingress', expect.any(Object));
    expect(JSON.parse(global.fetch.mock.calls[0][1].body)['cf-turnstile-response']).toBe('mock-turnstile-token');
  });

});
