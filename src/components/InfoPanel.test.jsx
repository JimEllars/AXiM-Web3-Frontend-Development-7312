import 'global-jsdom/register';
import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import { FiHome } from 'react-icons/fi';
import InfoPanel from './InfoPanel.jsx';

describe('InfoPanel Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders title and children correctly', () => {
    render(
      <InfoPanel title="Test Title" iconColor="text-blue-500">
        <p data-testid="child-content">Child content</p>
      </InfoPanel>
    );

    const titleElement = screen.getByText('Test Title');
    assert.ok(titleElement);
    assert.strictEqual(titleElement.tagName.toLowerCase(), 'h3');

    const childElement = screen.getByTestId('child-content');
    assert.ok(childElement);
    assert.strictEqual(childElement.textContent, 'Child content');
  });

  test('renders icon using SafeIcon with correct class', () => {
    render(
      <InfoPanel title="Icon Test" icon={FiHome} iconColor="text-red-500" />
    );

    const titleElement = screen.getByText('Icon Test');
    const svgElement = titleElement.querySelector('svg');
    assert.ok(svgElement);
    assert.ok(svgElement.classList.contains('text-red-500'));
  });

  test('handles missing props gracefully', () => {
    render(
      <InfoPanel>
        <div data-testid="only-children" />
      </InfoPanel>
    );

    const childElement = screen.getByTestId('only-children');
    assert.ok(childElement);
  });
});
