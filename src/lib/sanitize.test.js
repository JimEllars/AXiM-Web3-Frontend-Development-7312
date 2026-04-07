import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ensureSafeProtocol } from './sanitize.js';

describe('ensureSafeProtocol', () => {
  it('allows http and https URLs', () => {
    assert.strictEqual(ensureSafeProtocol('http://example.com'), 'http://example.com');
    assert.strictEqual(ensureSafeProtocol('https://example.com'), 'https://example.com');
    assert.strictEqual(ensureSafeProtocol('  https://example.com  '), 'https://example.com');
  });

  it('allows relative URLs', () => {
    assert.strictEqual(ensureSafeProtocol('/foo/bar'), '/foo/bar');
    assert.strictEqual(ensureSafeProtocol('foo/bar'), 'foo/bar');
    assert.strictEqual(ensureSafeProtocol('?query=1'), '?query=1');
    assert.strictEqual(ensureSafeProtocol('#hash'), '#hash');
  });

  it('blocks dangerous protocols', () => {
    assert.strictEqual(ensureSafeProtocol('javascript:alert(1)'), '#');
    assert.strictEqual(ensureSafeProtocol('  javascript:alert(1)'), '#');
    assert.strictEqual(ensureSafeProtocol('data:text/html,<script>alert(1)</script>'), '#');
    assert.strictEqual(ensureSafeProtocol('vbscript:msgbox(1)'), '#');
  });

  it('handles invalid inputs gracefully', () => {
    assert.strictEqual(ensureSafeProtocol(null), '#');
    assert.strictEqual(ensureSafeProtocol(undefined), '#');
    assert.strictEqual(ensureSafeProtocol(123), '#');
    assert.strictEqual(ensureSafeProtocol({}), '#');
    assert.strictEqual(ensureSafeProtocol(''), '#');
  });
});
