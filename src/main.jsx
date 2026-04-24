import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

// Explicitly import emotion to ensure resolution during build
import '@emotion/react';
import '@emotion/styled';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
              <QueryClientProvider client={new QueryClient()}>
        <HelmetProvider>
          <BrowserRouter>
          <App />
        </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
          </ErrorBoundary>
  </StrictMode>
);