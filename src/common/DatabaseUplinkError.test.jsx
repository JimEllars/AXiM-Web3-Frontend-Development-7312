import 'global-jsdom/register';
import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { render, screen, cleanup } from '@testing-library/react';
import DatabaseUplinkError from './DatabaseUplinkError.jsx';

test('DatabaseUplinkError renders correctly', () => {
  render(<DatabaseUplinkError />);
  const expectedText = "LOCAL_BUFFER_ACTIVE";

  const textElement = screen.getByText(expectedText);
  assert.ok(textElement, 'The component should render the exact error text');

  cleanup();
});
