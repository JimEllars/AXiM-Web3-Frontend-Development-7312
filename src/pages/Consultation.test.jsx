import 'global-jsdom/register';
import { test, describe, afterEach, beforeEach, vi } from 'vitest';
import assert from 'assert';
import { render, screen, cleanup, fireEvent, act } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Consultation from './Consultation.jsx';

describe('Consultation Page Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders multi-step consultation form', () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <Consultation />
        </MemoryRouter>
      </HelmetProvider>
    );

    // Initial step should be visible
    assert.ok(screen.getByText('1. Select Consultation Vector'));
    assert.ok(screen.getByText('AI Integration'));
    assert.ok(screen.getByText('Business Development'));

    // Move to step 2
    fireEvent.click(screen.getByText('AI Integration'));
    assert.ok(screen.getByText('2. Configure Parameters'));
    assert.ok(screen.getByText(/Vector:/).textContent.includes('AI Integration'));

    // Move to step 3 (Success)
    const inputs = screen.getAllByRole('textbox');
    const firstName = inputs.find(el => el.name === 'firstName');
    const lastName = inputs.find(el => el.name === 'lastName');
    const company = inputs.find(el => el.name === 'company');
    const details = inputs.find(el => el.name === 'details');

    // There is no role="textbox" for <input type="email">, so query by name
    const email = document.querySelector('input[name="email"]');

    fireEvent.change(firstName, { target: { value: 'John' } });
    fireEvent.change(lastName, { target: { value: 'Doe' } });
    fireEvent.change(email, { target: { value: 'test@example.com' } });
    fireEvent.change(company, { target: { value: 'ACME Corp' } });
    fireEvent.change(details, { target: { value: 'Some details here' } });

    const form = document.querySelector('form');
    fireEvent.submit(form);

    assert.ok(screen.getByText('Transmission Successful'));
  });
});
