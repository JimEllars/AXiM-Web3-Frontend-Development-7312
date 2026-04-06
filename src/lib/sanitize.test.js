import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';
import { sanitizeHTML, sanitizeURL } from './sanitize.js';

describe('sanitizeHTML', () => {
  test('should return empty string for null/undefined input', () => {
    assert.strictEqual(sanitizeHTML(null), '');
    assert.strictEqual(sanitizeHTML(undefined), '');
  });

  test('should safely sanitize without DOMParser fallback', () => {
    const input = '<script>alert(1)</script><p>Hello</p>';
    const output = sanitizeHTML(input);
    assert.strictEqual(output, '<p>Hello</p>');
  });

  test('should handle simple tag stripping without fallback', () => {
    const input = '<div>Test <iframe src="evil.com"></iframe></div>';
    const output = sanitizeHTML(input);
    assert.strictEqual(output, '<div>Test </div>');
  });

  describe('DOMPurify based sanitization', () => {
    test('should preserve safe tags and attributes', () => {
      const input = '<p class="text-white" id="main"><a href="https://axim.us.com" target="_blank" rel="noopener"><strong>AXiM</strong></a></p>';
      const output = sanitizeHTML(input);
      assert.strictEqual(output, input);
    });

    test('should strip unsafe tags but keep safe children text', () => {
      const input = '<script>alert(1)</script><div>Hello <iframe src="evil.com"></iframe>World</div>';
      const output = sanitizeHTML(input);
      assert.strictEqual(output, '<div>Hello World</div>');
    });

    test('should remove dangerous protocols from uri-like attributes', () => {
      const input = '<a href="javascript:alert(1)">Click me</a>';
      const output = sanitizeHTML(input);
      assert.strictEqual(output, '<a>Click me</a>');
    });

    test('should allow valid protocols in uri-like attributes', () => {
      const input = '<a href="https://example.com/action">Action</a>';
      const output = sanitizeHTML(input);
      assert.strictEqual(output, input);
    });

    test('should handle nested allowed tags', () => {
      const input = '<ul><li><em>Item 1</em></li><li><code>Item 2</code></li></ul>';
      const output = sanitizeHTML(input);
      assert.strictEqual(output, input);
    });
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
