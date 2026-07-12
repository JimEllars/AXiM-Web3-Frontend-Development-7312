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
    expect(screen.getByTestId('seo-title').textContent).toBe('Custom AI Chatbot | AXiM x Chatbase');
    expect(screen.getByTestId('seo-desc').textContent).toBe('Deploy a custom ChatGPT agent trained exclusively on your business data. Automate customer support and capture leads 24/7.');
  });

  it('renders the correct affiliate link', () => {
    renderWithProviders(<ChatbaseLanding />);
    const affiliateLink = screen.getAllByText(/Build Your Agent for Free/i)[0];
    expect(affiliateLink).not.toBeNull();
    expect(affiliateLink.getAttribute('href')).toBe('https://link.chatbase.co/jrellars?via=axim_hub');
    expect(affiliateLink.getAttribute('target')).toBe('_blank');
    expect(affiliateLink.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders main headings', () => {
    renderWithProviders(<ChatbaseLanding />);
    expect(screen.getAllByText(/AI Support Agent./i)[0]).not.toBeNull();
    expect(screen.getAllByText(/How Your AI Learns/i)[0]).not.toBeNull();
  });
});
