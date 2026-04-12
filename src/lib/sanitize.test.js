import test from 'node:test';
import assert from 'node:assert';
import { sanitizeHTML, ensureSafeProtocol } from './sanitize.js';

test('sanitizeHTML - removes script tags', () => {
  const input = '<p>Hello <script>alert("xss")</script>World</p>';
  const expected = '<p>Hello World</p>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - removes event handlers', () => {
  const input = '<p onmouseover="alert(1)">Hover me</p>';
  const expected = '<p>Hover me</p>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - blocks javascript: in href', () => {
  const input = '<a href="javascript:alert(1)">Click me</a>';
  const expected = '<a href="#">Click me</a>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - blocks dangerous protocols in allowed tags', () => {
  const input = '<a href="javascript:alert(1)">Click me</a>';
  const expected = '<a href="#">Click me</a>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - allows safe tags and attributes', () => {
  const input = '<div class="test"><h1 id="main">Title</h1><p>Text with <strong>bold</strong> and <em>italics</em>.</p><ul><li>Item</li></ul></div>';
  const expected = '<div class="test"><h1 id="main">Title</h1><p>Text with <strong>bold</strong> and <em>italics</em>.</p><ul><li>Item</li></ul></div>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - removes disallowed tags', () => {
  const input = '<marquee>Not allowed</marquee> <p>Allowed</p> <img src="x">';
  const expected = 'Not allowed <p>Allowed</p> ';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - handles falsy inputs', () => {
  assert.strictEqual(sanitizeHTML(null), '');
  assert.strictEqual(sanitizeHTML(undefined), '');
  assert.strictEqual(sanitizeHTML(''), '');
});

test('ensureSafeProtocol - allows http and https', () => {
  assert.strictEqual(ensureSafeProtocol('http://example.com'), 'http://example.com');
  assert.strictEqual(ensureSafeProtocol('https://example.com/path?query=1'), 'https://example.com/path?query=1');
});

test('ensureSafeProtocol - allows relative paths', () => {
  assert.strictEqual(ensureSafeProtocol('/internal/path'), '/internal/path');
  assert.strictEqual(ensureSafeProtocol('#anchor'), '#anchor');
});

test('ensureSafeProtocol - blocks dangerous protocols', () => {
  assert.strictEqual(ensureSafeProtocol('javascript:alert(1)'), '#');
  assert.strictEqual(ensureSafeProtocol('data:text/html,xss'), '#');
  assert.strictEqual(ensureSafeProtocol('vbscript:msgbox(1)'), '#');
});

test('ensureSafeProtocol - handles falsy inputs', () => {
  assert.strictEqual(ensureSafeProtocol(null), '#');
  assert.strictEqual(ensureSafeProtocol(undefined), '#');
  assert.strictEqual(ensureSafeProtocol(''), '#');
});
