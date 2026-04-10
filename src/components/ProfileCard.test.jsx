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

  test('renders with provided address and clearance level', () => {
    const props = {
      address: '0x1234...5678',
      clearanceLevel: 5
    };
    render(<ProfileCard {...props} />);

    assert.ok(screen.getByText('Operator'));
    assert.ok(screen.getByText('0x1234...5678'));
    assert.ok(screen.getByText('CLEARANCE_LEVEL_5'));
  });

  test('renders with default clearance level when none is provided', () => {
    const props = {
      address: '0xabcd...efgh'
    };
    render(<ProfileCard {...props} />);

    assert.ok(screen.getByText('0xabcd...efgh'));
    assert.ok(screen.getByText('CLEARANCE_LEVEL_1'));
  });

  test('handles missing address prop gracefully', () => {
    render(<ProfileCard clearanceLevel={3} />);

    assert.ok(screen.getByText('CLEARANCE_LEVEL_3'));
    // The p tag for address is still there but might be empty or undefined
    // We just check it doesn't crash
  });
});
