import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.jsx';
import { ThirdwebProvider } from 'thirdweb/react';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';
import { logTelemetry } from './lib/telemetry.js';


// Explicitly import emotion to ensure resolution during build
import '@emotion/react';
import '@emotion/styled';


window.addEventListener('unhandledrejection', (event) => {
  logTelemetry('UNHANDLED_PROMISE', { reason: event.reason?.message || 'Unknown Promise Rejection' });
});

window.addEventListener('error', (event) => {
  logTelemetry('GLOBAL_ERROR', { message: event.message, source: event.filename, line: event.lineno });
});

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <ErrorBoundary>
              <QueryClientProvider client={new QueryClient()}>
        <HelmetProvider>
          <BrowserRouter>
          <ThirdwebProvider>
            <App />
          </ThirdwebProvider>
        </BrowserRouter>
        </HelmetProvider>
      </QueryClientProvider>
          </ErrorBoundary>
  </StrictMode>
);