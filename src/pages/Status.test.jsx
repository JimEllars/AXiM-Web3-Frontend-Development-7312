import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Status from './Status';

describe('Status Component', () => {
  const renderStatus = () => {
    return render(
      <MemoryRouter>
        <HelmetProvider>
          <Status />
        </HelmetProvider>
      </MemoryRouter>
    );
  };

  it('renders operational heading and components', () => {
    renderStatus();
    expect(screen.getByText(/All Systems/i)).toBeInTheDocument();
    expect(screen.getByText(/Operational./i)).toBeInTheDocument();

    // Check if services are rendered
    expect(screen.getByText(/AXiM Core Proxy/i)).toBeInTheDocument();
    expect(screen.getByText(/Onyx Edge Workers/i)).toBeInTheDocument();
    expect(screen.getByText(/Operator Database Vault/i)).toBeInTheDocument();
    expect(screen.getByText(/Content Delivery Network/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Cognitive Routing/i)).toBeInTheDocument();

    // Check support link
    expect(screen.getByRole('link', { name: /Open Support Ticket/i })).toBeInTheDocument();
  });
});
