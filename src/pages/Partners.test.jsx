import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import Partners from './Partners';
import { HelmetProvider } from 'react-helmet-async';
import { useAximStore } from '../store/useAximStore';

describe('Partners Page Component', () => {
  beforeAll(() => {
    const mockIntersectionObserver = class {
      constructor() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    global.IntersectionObserver = mockIntersectionObserver;
  });

  beforeEach(() => {
    useAximStore.setState({ partnerLeads: [] });
  });

  afterEach(() => {
    useAximStore.setState({ partnerLeads: [] });
  });

  it('renders the page and submits a lead correctly', async () => {
    const { container } = render(
      <HelmetProvider>
        <Partners />
      </HelmetProvider>
    );

    // Assert text elements
    expect(screen.getByText('Enterprise-Grade Fiber Connectivity')).toBeTruthy();
    expect(screen.getByText('Request Site Survey')).toBeTruthy();

    // Fill form
    fireEvent.change(screen.getByPlaceholderText('Acme Corp'), { target: { value: 'Test Corp' } });
    fireEvent.change(screen.getByPlaceholderText('Jane Doe'), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText('jane@acmecorp.com'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('123 Tech Blvd, San Francisco, CA'), { target: { value: '123 Test St' } });

    // Submit form
    const submitBtn = screen.getByText('Request Site Survey');
    fireEvent.click(submitBtn);

    // Assert UI changes
    await waitFor(() => {
      expect(screen.getByText('Request Received')).toBeTruthy();
    });

    // Assert store update
    const leads = useAximStore.getState().partnerLeads;
    expect(leads.length).toBe(1);
    expect(leads[0].companyName).toBe('Test Corp');
    expect(leads[0].status).toBe('Pending Review');
  });
});
