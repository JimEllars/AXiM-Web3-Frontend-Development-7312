import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { getWordPressPost } from './wp-fetch.js';

describe('getWordPressPost', () => {
  let originalFetch;
  let originalConsoleError;
  let originalEnvUrl;

  beforeEach(() => {
    originalFetch = global.fetch;
    originalConsoleError = console.error;
    originalEnvUrl = process.env.VITE_WORDPRESS_URL;
    delete process.env.VITE_WORDPRESS_URL;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    console.error = originalConsoleError;
    if (originalEnvUrl !== undefined) {
      process.env.VITE_WORDPRESS_URL = originalEnvUrl;
    } else {
      delete process.env.VITE_WORDPRESS_URL;
    }
  });

  test('should return null if VITE_WORDPRESS_URL is not set', async () => {
    const result = await getWordPressPost('some-slug');
    assert.strictEqual(result, null);
  });

  test('should return data if fetch is successful', async () => {
    process.env.VITE_WORDPRESS_URL = 'http://mock-wp.com/graphql';
    const mockData = { data: { post: { title: 'Hello', content: 'World' } } };

    global.fetch = async (url, options) => {
      assert.strictEqual(url, 'http://mock-wp.com/graphql');
      assert.strictEqual(options.method, 'POST');
      assert.strictEqual(options.headers['Content-Type'], 'application/json');

      const body = JSON.parse(options.body);
      assert.strictEqual(body.variables.slug, 'test-slug');
      assert.ok(body.query.includes('query GetPost($slug: ID!)'));

      return {
        json: async () => mockData
      };
    };

    const result = await getWordPressPost('test-slug');
    assert.deepStrictEqual(result, mockData);
  });

  test('should return null and log error if fetch throws', async () => {
    process.env.VITE_WORDPRESS_URL = 'http://mock-wp.com/graphql';

    global.fetch = async () => {
      throw new Error('Network error');
    };

    let errorLogged = false;
    console.error = (msg, err) => {
      if (msg === 'WP Fetch Error:' && err.message === 'Network error') {
        errorLogged = true;
      }
    };

    const result = await getWordPressPost('fail-slug');
    assert.strictEqual(result, null);
    assert.strictEqual(errorLogged, true);
  });

  test('should return null and log error if json parsing fails', async () => {
    process.env.VITE_WORDPRESS_URL = 'http://mock-wp.com/graphql';

    global.fetch = async () => {
      return {
        json: async () => {
          throw new Error('Invalid JSON');
        }
      };
    };

    let errorLogged = false;
    console.error = (msg, err) => {
      if (msg === 'WP Fetch Error:' && err.message === 'Invalid JSON') {
        errorLogged = true;
      }
    };

    const result = await getWordPressPost('fail-slug');
    assert.strictEqual(result, null);
    assert.strictEqual(errorLogged, true);
  });
});
