import 'global-jsdom/register';
import React from 'react';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { render, screen, cleanup } from '@testing-library/react';
import DatabaseUplinkError from './DatabaseUplinkError.jsx';

test('DatabaseUplinkError renders correctly', () => {
  render(<DatabaseUplinkError />);
  const expectedText = "Establishing secure uplink to AXiM Database... If this persists, verify CORS headers on the origin server.";

  const textElement = screen.getByText(expectedText);
  assert.ok(textElement, 'The component should render the exact error text');

  cleanup();
});
