import { test, describe } from 'node:test';
import assert from 'node:assert';
import { sanitizeHTML, sanitizeURL } from './sanitize.js';

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

describe('sanitizeURL', () => {
  test('should return "#" for null/undefined/empty input', () => {
    assert.strictEqual(sanitizeURL(null), '#');
    assert.strictEqual(sanitizeURL(undefined), '#');
    assert.strictEqual(sanitizeURL(''), '#');
  });

  test('should allow valid http and https URLs', () => {
    assert.strictEqual(sanitizeURL('http://example.com'), 'http://example.com');
    assert.strictEqual(sanitizeURL('https://axim.us.com/path'), 'https://axim.us.com/path');
  });

  test('should block dangerous protocols', () => {
    assert.strictEqual(sanitizeURL('javascript:alert(1)'), '#');
    assert.strictEqual(sanitizeURL('  JAVASCRIPT:alert(1)'), '#');
    assert.strictEqual(sanitizeURL('data:text/html,<script>alert(1)</script>'), '#');
    assert.strictEqual(sanitizeURL('vbscript:msgbox("hello")'), '#');
  });

  test('should allow relative paths and anchors', () => {
    assert.strictEqual(sanitizeURL('/relative/path'), '/relative/path');
    assert.strictEqual(sanitizeURL('#anchor'), '#anchor');
    assert.strictEqual(sanitizeURL('post-slug'), 'post-slug');
  });
});
