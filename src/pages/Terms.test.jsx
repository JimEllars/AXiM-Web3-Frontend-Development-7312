import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
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
    expect(screen.getByText(/Legal &/i)).toBeInTheDocument();
    expect(screen.getByText(/Compliance./i)).toBeInTheDocument();

    expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
    expect(screen.getByText(/Data Processing/i)).toBeInTheDocument();
  });

  it('switches between tabs', () => {
    renderTerms();

    // Default tab is Terms of Service
    expect(screen.getAllByText(/1. Operator Responsibilities/i)[0]).toBeInTheDocument();
    expect(screen.queryByText(/Data Ingestion/i)).not.toBeInTheDocument();

    // Click Privacy Policy
    fireEvent.click(screen.getByRole('button', { name: /Privacy Policy/i }));
    expect(screen.getByText(/Data Ingestion/i)).toBeInTheDocument();
    expect(screen.queryByText(/1. Operator Responsibilities/i)).not.toBeInTheDocument();

    // Click Data Processing Agreement
    fireEvent.click(screen.getByRole('button', { name: /Data Processing/i }));
    expect(screen.getByText(/Sub-Processors/i)).toBeInTheDocument();
  });
});
