import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThirdwebProvider } from "thirdweb/react";
import { HashRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';

// Explicitly import emotion to ensure resolution during build
import '@emotion/react';
import '@emotion/styled';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThirdwebProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ThirdwebProvider>
  </StrictMode>
);