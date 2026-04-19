import test from 'node:test';
import assert from 'node:assert';
import { ensureSafeProtocol } from './sanitize.js';

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
