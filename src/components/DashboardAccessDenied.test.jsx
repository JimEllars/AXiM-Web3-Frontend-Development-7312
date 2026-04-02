import 'global-jsdom/register';
import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import DashboardAccessDenied from './DashboardAccessDenied.jsx';

// Mock thirdweb/react
import * as thirdwebReact from 'thirdweb/react';
thirdwebReact.ConnectButton = () => <div data-testid="mock-connect-button">Mock Connect Button</div>;

// Mock framer-motion
import * as framerMotion from 'framer-motion';
framerMotion.motion = {
  div: ({ children, ...props }) => <div {...props}>{children}</div>,
  h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
  p: ({ children, ...props }) => <p {...props}>{children}</p>,
};

describe('DashboardAccessDenied Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders Access Denied heading', () => {
    render(<DashboardAccessDenied />);
    assert.ok(screen.getByText(/Access Denied/i));
  });

  test('renders authentication required message', () => {
    render(<DashboardAccessDenied />);
    assert.ok(screen.getByText(/Connect Web3 identity to authenticate session/i));
  });

  test('renders status and error code', () => {
    render(<DashboardAccessDenied />);
    assert.ok(screen.getByText(/Status: Await_Handshake \/\/ Error: 0xAUTH_REQ/i));
  });

  test('renders ConnectButton', () => {
    render(<DashboardAccessDenied />);
    assert.ok(screen.getByTestId('mock-connect-button'));
  });
});
