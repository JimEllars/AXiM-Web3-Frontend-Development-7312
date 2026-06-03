import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ChatbaseLanding from './ChatbaseLanding';

// Mock components
vi.mock('../../components/SEO', () => ({
  default: ({ title, description }) => (
    <div data-testid="mock-seo">
      <span data-testid="seo-title">{title}</span>
      <span data-testid="seo-desc">{description}</span>
    </div>
  )
}));

const renderWithProviders = (ui) => {
  return render(
    <HelmetProvider>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </HelmetProvider>
  );
};

describe('ChatbaseLanding', () => {
  it('renders SEO component with correct props', () => {
    renderWithProviders(<ChatbaseLanding />);
    expect(screen.getByTestId('mock-seo')).not.toBeNull();
    expect(screen.getByTestId('seo-title').textContent).toBe('Custom AI Concierge Framework | AXiM x Chatbase');
    expect(screen.getByTestId('seo-desc').textContent).toBe('Convert unstructured documents into intelligent frontline support agents. Integrate an isolated AI triage module trained on your brand guidelines.');
  });

  it('renders the correct affiliate link', () => {
    renderWithProviders(<ChatbaseLanding />);
    const affiliateLink = screen.getAllByText(/Initialize AI Concierge/i)[0];
    expect(affiliateLink).not.toBeNull();
    expect(affiliateLink.getAttribute('href')).toBe('https://link.chatbase.co/jrellars');
    expect(affiliateLink.getAttribute('target')).toBe('_blank');
    expect(affiliateLink.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders main headings', () => {
    renderWithProviders(<ChatbaseLanding />);
    expect(screen.getAllByText(/Decoupled Custom AI/i)[0]).not.toBeNull();
    expect(screen.getAllByText(/Ingestion Matrix Modalities/i)[0]).not.toBeNull();
  });
});
