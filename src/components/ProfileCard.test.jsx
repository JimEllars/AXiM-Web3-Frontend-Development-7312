import 'global-jsdom/register';
import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import ProfileCard from './ProfileCard.jsx';

describe('ProfileCard Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders with the provided address', () => {
    const testAddress = '0x1234567890abcdef';
    render(<ProfileCard address={testAddress} clearanceLevel={1} />);

    const addressElement = screen.getByText(testAddress);
    assert.ok(addressElement);
    assert.ok(addressElement.classList.contains('font-mono'));
  });

  test('renders with the provided clearanceLevel', () => {
    render(<ProfileCard address="0x123" clearanceLevel={5} />);

    assert.ok(screen.getByText('CLEARANCE_LEVEL_5'));
  });

  test('defaults clearanceLevel to 1 if not provided', () => {
    render(<ProfileCard address="0x123" />);

    assert.ok(screen.getByText('CLEARANCE_LEVEL_1'));
  });

  test('the "Operator" title is present', () => {
    render(<ProfileCard address="0x123" />);

    assert.ok(screen.getByText('Operator'));
  });
});
