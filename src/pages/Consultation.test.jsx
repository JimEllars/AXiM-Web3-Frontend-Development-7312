import 'global-jsdom/register';
import { test, describe, afterEach } from 'vitest';
import assert from 'node:assert/strict';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Consultation from './Consultation.jsx';

describe('Consultation Page Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders consultation page correctly', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <Consultation />
        </MemoryRouter>
      </HelmetProvider>
    );

    assert.ok(screen.getByRole('heading', { name: /System Strategy Call/i }));
    assert.ok(screen.getByText('Workflow Audits'));
    assert.ok(screen.getByText('AI Implementation'));
    assert.ok(screen.getByText('Security Briefing'));
    assert.ok(screen.getByText(/Request A Consultation/i));
  });
});
