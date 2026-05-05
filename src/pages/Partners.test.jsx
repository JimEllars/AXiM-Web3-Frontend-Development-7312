import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';
import Partners from './Partners';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter } from 'react-router-dom';
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
      <MemoryRouter><HelmetProvider>
        <Partners />
      </HelmetProvider></MemoryRouter>
    );

    // Assert text elements
    expect(screen.getByText('Enterprise-Grade Fiber Connectivity')).toBeTruthy();

    // There are now two forms. Let's test the Fiber form.
    expect(screen.getByText('Submit Infrastructure Request')).toBeTruthy();

    // Fill form
    fireEvent.change(screen.getAllByPlaceholderText('Acme Corp')[0], { target: { value: 'Test Corp' } });
    fireEvent.change(screen.getAllByPlaceholderText('Jane Doe')[0], { target: { value: 'Test User' } });
    fireEvent.change(screen.getAllByPlaceholderText('jane@acmecorp.com')[0], { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('123 Industrial Pkwy, Austin, TX'), { target: { value: '123 Test St' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. 50,000'), { target: { value: '50000' } });
    fireEvent.change(screen.getByPlaceholderText('$5,000+'), { target: { value: '5000' } });

    // Submit form
    const submitBtn = screen.getByText('Submit Infrastructure Request');
    fireEvent.click(submitBtn);

    // Assert UI changes
    await waitFor(() => {
      expect(screen.getByText('Request Received')).toBeTruthy();
    });

    // Assert store update
    const leads = useAximStore.getState().partnerLeads;
    expect(leads.length).toBe(1);
    expect(leads[0].companyName).toBe('Test Corp');
    expect(leads[0].serviceInterest).toBe('Solar Infrastructure');
    expect(leads[0].status).toBe('Pending');
  });
});