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

    // There are now two forms. Let's test the Fiber form.
    expect(screen.getByText('Submit Connectivity Request')).toBeTruthy();

    // Fill form
    fireEvent.change(screen.getAllByPlaceholderText('Acme Corp')[0], { target: { value: 'Test Corp' } });
    fireEvent.change(screen.getAllByPlaceholderText('Jane Doe')[0], { target: { value: 'Test User' } });
    fireEvent.change(screen.getAllByPlaceholderText('jane@acmecorp.com')[0], { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('123 Tech Blvd, San Francisco, CA'), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getAllByRole('combobox')[0], { target: { value: '10 Gbps' } });

    // Submit form
    const submitBtn = screen.getByText('Submit Connectivity Request');
    fireEvent.click(submitBtn);

    // Assert UI changes
    await waitFor(() => {
      expect(screen.getByText('Request Received')).toBeTruthy();
    });

    // Assert store update
    const leads = useAximStore.getState().partnerLeads;
    expect(leads.length).toBe(1);
    expect(leads[0].companyName).toBe('Test Corp');
    expect(leads[0].serviceInterest).toBe('Fiber Connectivity');
    expect(leads[0].status).toBe('Pending Review');
  });
});