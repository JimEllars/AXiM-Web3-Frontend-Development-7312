import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect } from 'vitest';

import Terms from './Terms';

describe('Terms Component', () => {
  const renderTerms = () => {
    return render(
      <MemoryRouter>
        <HelmetProvider>
          <Terms />
        </HelmetProvider>
      </MemoryRouter>
    );
  };

  it('renders title and navigation tabs', () => {
    renderTerms();
    expect(screen.getByText(/Legal &/i)).not.toBeNull();
    expect(screen.getByText(/Compliance./i)).not.toBeNull();

    expect(screen.getAllByText(/Terms of Service/i)[0]).not.toBeNull();
    expect(screen.getByText(/Privacy Policy/i)).not.toBeNull();
    expect(screen.getByText(/Data Processing/i)).not.toBeNull();
  });

  it('switches between tabs', () => {
    renderTerms();

    // Default tab is Terms of Service
    expect(screen.getAllByText(/1. Operator Responsibilities/i)[0]).not.toBeNull();
    expect(screen.queryByText(/Data Ingestion/i)).toBeNull();

    // Click Privacy Policy
    fireEvent.click(screen.getAllByRole('button', { name: /Privacy Policy/i })[0]);
    expect(screen.getByText(/Data Ingestion/i)).not.toBeNull();
    expect(screen.queryByText(/1. Operator Responsibilities/i)).not.toBeNull();

    // Click Data Processing Agreement
    fireEvent.click(screen.getAllByRole('button', { name: /Data Processing/i })[0]);
    expect(screen.getAllByText(/Sub-Processors/i)[0]).not.toBeNull();
  });
});
