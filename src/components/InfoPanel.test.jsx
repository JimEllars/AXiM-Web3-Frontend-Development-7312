import 'global-jsdom/register';
import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert';
import { render, screen, cleanup } from '@testing-library/react';
import React from 'react';
import InfoPanel from './InfoPanel.jsx';

describe('InfoPanel Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders title and children correctly', () => {
    render(
      <InfoPanel title="Test Title">
        <div data-testid="test-child">Child Content</div>
      </InfoPanel>
    );

    assert.ok(screen.getByText('Test Title'));
    assert.ok(screen.getByTestId('test-child'));
    assert.strictEqual(screen.getByTestId('test-child').textContent, 'Child Content');
  });

  test('passes icon and iconColor to SafeIcon', () => {
    const MockIcon = ({ className }) => <span data-testid="mock-icon" className={className}>Icon</span>;

    render(
      <InfoPanel title="Icon Test" icon={MockIcon} iconColor="text-red-500">
        <p>Content</p>
      </InfoPanel>
    );

    const iconEl = screen.getByTestId('mock-icon');
    assert.ok(iconEl);
    assert.ok(iconEl.classList.contains('text-red-500'));
  });

  test('handles missing props gracefully', () => {
    // Should render correctly without crashing when optional props are omitted
    render(
      <InfoPanel>
        <p data-testid="only-child">Content</p>
      </InfoPanel>
    );

    assert.ok(screen.getByTestId('only-child'));
  });

  test('renders with empty strings for title and iconColor without crashing', () => {
    render(
      <InfoPanel title="" iconColor="">
        <p data-testid="empty-strings">Content</p>
      </InfoPanel>
    );

    assert.ok(screen.getByTestId('empty-strings'));
  });
});
