import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThirdwebProvider } from "thirdweb/react";
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
      <ThirdwebProvider>
        <QueryClientProvider client={new QueryClient()}>
        <HelmetProvider>
          <BrowserRouter>
          <App />
        </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
      </ThirdwebProvider>
    </ErrorBoundary>
  </StrictMode>
);