import test from 'node:test';
import assert from 'node:assert';
import { sanitizeHTML, ensureSafeProtocol } from './sanitize.js';

test('sanitizeHTML - removes script tags', () => {
  const input = '<p>Hello <script>alert("xss")</script>World</p>';
  const expected = '<p>Hello World</p>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - removes HTML comments', () => {
  const input = '<p>Hello <!-- hidden comment -->World</p><!-- \n multi line \n comment -->';
  const expected = '<p>Hello World</p>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - removes other dangerous tags', () => {
  const input = '<div><style>.hidden { display: none; }</style><iframe src="evil.com"></iframe>Text</div>';
  const expected = '<div>Text</div>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - removes self-closing dangerous tags', () => {
  const input = '<head><meta charset="utf-8" /><link rel="stylesheet" href="style.css"></head><p>Safe</p>';
  const expected = '<p>Safe</p>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - handles multiline dangerous tags', () => {
  const input = '<p>Start</p>\n<script>\n  alert("xss");\n</script>\n<p>End</p>';
  // The regex replaces the whole tag with empty string, but preserves newlines around it
  const expected = '<p>Start</p>\n\n<p>End</p>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - removes event handlers', () => {
  const input = '<p onmouseover="alert(1)">Hover me</p>';
  const expected = '<p>Hover me</p>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - removes event handlers with unquoted and single quoted values', () => {
  const input1 = '<p onmouseover=alert(1)>Hover me</p>';
  const expected1 = '<p>Hover me</p>';
  assert.strictEqual(sanitizeHTML(input1), expected1);

  const input2 = "<p onclick='alert(1)'>Click me</p>";
  const expected2 = '<p>Click me</p>';
  assert.strictEqual(sanitizeHTML(input2), expected2);
});

test('sanitizeHTML - handles case-insensitivity in event handlers', () => {
  const input = '<p ONCLICK="alert(1)">Click me</p>';
  const expected = '<p>Click me</p>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - blocks javascript: in href', () => {
  const input = '<a href="javascript:alert(1)">Click me</a>';
  const expected = '<a href="#">Click me</a>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - blocks dangerous protocols with mixed casing and single quotes', () => {
  const input = "<a href='JaVaScRiPt:alert(1)'>Click me</a>";
  const expected = '<a href="#">Click me</a>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - blocks data: protocols', () => {
  const input = '<a href="data:text/html,<html>">Link</a>';
  const expected = '<a href="#">Link</a>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - blocks vbscript: protocols', () => {
  const input = '<a href="vbscript:msgbox(1)">Link</a>';
  const expected = '<a href="#">Link</a>';
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

test('sanitizeHTML - handles slash separators (bypass fix)', () => {
  const input = '<p/onclick=alert(1)>Click me</p>';
  const expected = '<p>Click me</p>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - blocks obfuscated protocols (bypass fix)', () => {
  const input = '<a href="java\nscript:alert(1)">Link</a>';
  const expected = '<a href="#">Link</a>';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - recursive tag removal (bypass fix)', () => {
  const input = '<scr<script>ipt>alert(1)</script>';
  const expected = '';
  assert.strictEqual(sanitizeHTML(input), expected);
});

test('sanitizeHTML - strict attribute allowlist', () => {
  const input = '<p title="test" style="color:red" data-foo="bar">Content</p>';
  const expected = '<p title="test">Content</p>';
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
