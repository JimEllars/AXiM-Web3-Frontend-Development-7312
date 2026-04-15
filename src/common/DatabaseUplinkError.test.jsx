import 'global-jsdom/register';
import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import DatabaseUplinkError from './DatabaseUplinkError.jsx';

describe('DatabaseUplinkError Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders the database uplink error message', () => {
    render(<DatabaseUplinkError />);

    const errorMessage = screen.getByText(/Establishing secure uplink to AXiM Database/i);
    assert.ok(errorMessage, 'Error message should be present');
    assert.ok(errorMessage.textContent.includes('verify CORS headers'), 'Error message should mention CORS headers');
  });

  test('has the correct CSS classes for styling', () => {
    const { container } = render(<DatabaseUplinkError />);

    const section = container.querySelector('section');
    assert.ok(section, 'Should have a section element');
    assert.ok(section.classList.contains('py-16'), 'Section should have py-16 class');
    assert.ok(section.classList.contains('relative'), 'Section should have relative class');

    const paragraph = container.querySelector('p');
    assert.ok(paragraph.classList.contains('text-zinc-500'), 'Paragraph should have text-zinc-500 class');
    assert.ok(paragraph.classList.contains('font-mono'), 'Paragraph should have font-mono class');
  });
});
