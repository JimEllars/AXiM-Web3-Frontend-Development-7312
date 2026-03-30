import 'global-jsdom/register';
import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import SafeIcon from './SafeIcon.jsx';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';
import { LuActivity } from 'react-icons/lu';

describe('SafeIcon Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('Renders directly passed IconComponent', () => {
    const { container } = render(<SafeIcon icon={FiHome} data-testid="direct-icon" />);
    const iconElement = screen.getByTestId('direct-icon');
    assert.ok(iconElement);
    // FiHome renders an svg with specific paths or structure, but we can verify it renders the component
    assert.strictEqual(iconElement.tagName.toLowerCase(), 'svg');
  });

  test('Renders icon by name from LuIcons', () => {
    const { container } = render(<SafeIcon name="LuActivity" data-testid="lu-icon" />);
    const iconElement = screen.getByTestId('lu-icon');
    assert.ok(iconElement);
    assert.strictEqual(iconElement.tagName.toLowerCase(), 'svg');
  });

  test('Renders icon by name from FiIcons', () => {
    const { container } = render(<SafeIcon name="FiHome" data-testid="fi-icon" />);
    const iconElement = screen.getByTestId('fi-icon');
    assert.ok(iconElement);
    assert.strictEqual(iconElement.tagName.toLowerCase(), 'svg');
  });

  test('Renders fallback alert icon when name is not found', () => {
    const { container } = render(<SafeIcon name="NonExistentIconXYZ" data-testid="fallback-icon" />);
    const iconElement = screen.getByTestId('fallback-icon');
    assert.ok(iconElement);
    assert.strictEqual(iconElement.tagName.toLowerCase(), 'svg');
  });


  test('Renders fallback alert icon when no icon or name is provided', () => {
    const { container } = render(<SafeIcon data-testid="fallback-empty-icon" />);
    const iconElement = screen.getByTestId('fallback-empty-icon');
    assert.ok(iconElement);
    assert.strictEqual(iconElement.tagName.toLowerCase(), 'svg');
  });
});
