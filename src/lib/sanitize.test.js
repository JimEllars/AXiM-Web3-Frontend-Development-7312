import { test, describe } from 'node:test';
import assert from 'node:assert';
import { sanitizeHTML } from './sanitize.js';

describe('sanitizeHTML', () => {
  test('should return empty string for null/undefined input', () => {
    assert.strictEqual(sanitizeHTML(null), '');
    assert.strictEqual(sanitizeHTML(undefined), '');
  });

  test('should fallback to regex stripping if DOMParser is unavailable', () => {
    const originalWindow = global.window;
    global.window = {}; // No DOMParser on window
    const input = '<script>alert(1)</script><p>Hello</p>';
    const output = sanitizeHTML(input);
    assert.strictEqual(output, 'alert(1)Hello');
    global.window = originalWindow;
  });

  test('should handle simple tag stripping when DOMParser is unavailable', () => {
    const originalWindow = global.window;
    global.window = undefined;
    const input = '<div>Test <iframe src="evil.com"></iframe></div>';
    const output = sanitizeHTML(input);
    assert.strictEqual(output, 'Test ');
    global.window = originalWindow;
  });
});
