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

  test('Renders fallback and warns when icon name access throws an error', () => {
    const originalWarn = console.warn;
    let warningCalled = false;

    try {
      console.warn = (msg) => {
        warningCalled = true;
        assert.match(msg, /Icon badName not found/);
      };

      let throwCount = 0;
      const badName = {
        toString: () => {
          if (throwCount++ === 0) {
            throw new Error('Cannot convert to string');
          }
          return 'badName';
        }
      };

      const { container } = render(<SafeIcon name={badName} data-testid="error-fallback-icon" />);
      const iconElement = screen.getByTestId('error-fallback-icon');
      assert.ok(iconElement);
      assert.strictEqual(iconElement.tagName.toLowerCase(), 'svg');
      assert.ok(warningCalled, 'console.warn should have been called');
    } finally {
      console.warn = originalWarn;
    }
  });

  test('Missing Error Case Test for SafeIcon missing name fallback', () => {
    const { container } = render(<SafeIcon name="NonExistentIconXYZ2" />);
    assert.ok(container.innerHTML.includes('line'), 'Should render the FiAlertTriangle lines');
  });
});
