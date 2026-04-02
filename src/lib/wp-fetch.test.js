import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { getWordPressPost, fetchPostsByCategory, fetchCache } from './wp-fetch.js';

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

  test('should use import.meta.env if available (mocked implicitly)', async () => {
    // If the test runner exposes import.meta.env, we want to make sure it handles correctly.
    // Since we're in node, we'll set process.env and let the fallback handle it,
    // achieving line execution.
    process.env.VITE_WORDPRESS_URL = 'http://mock-wp.com/graphql';
    global.fetch = async () => ({
      json: async () => ({ data: 'success' })
    });
    const result = await getWordPressPost('some-slug');
    assert.deepStrictEqual(result, { data: 'success' });
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

    const localOriginalFetch = global.fetch;
    const localOriginalConsoleError = console.error;

    try {
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
    } finally {
      global.fetch = localOriginalFetch;
      console.error = localOriginalConsoleError;
    }
  });

  test('should return null and log error if fetch rejects', async () => {
    process.env.VITE_WORDPRESS_URL = 'http://mock-wp.com/graphql';

    const localOriginalFetch = global.fetch;
    const localOriginalConsoleError = console.error;

    try {
      global.fetch = async () => Promise.reject(new Error('Rejected fetch error'));

      let errorLogged = false;
      console.error = (msg, err) => {
        if (msg === 'WP Fetch Error:' && err.message === 'Rejected fetch error') {
          errorLogged = true;
        }
      };

      const result = await getWordPressPost('reject-slug');
      assert.strictEqual(result, null);
      assert.strictEqual(errorLogged, true);
    } finally {
      global.fetch = localOriginalFetch;
      console.error = localOriginalConsoleError;
    }
  });

  test('should return null and log error if fetch returns a non-200 response with unparseable body', async () => {
    process.env.VITE_WORDPRESS_URL = 'http://mock-wp.com/graphql';

    const localOriginalFetch = global.fetch;
    const localOriginalConsoleError = console.error;

    try {
      global.fetch = async () => {
        return {
          ok: false,
          status: 500,
          json: async () => {
            throw new Error('Unexpected token < in JSON at position 0');
          }
        };
      };

      let errorLogged = false;
      console.error = (msg, err) => {
        if (msg === 'WP Fetch Error:' && err.message.includes('Unexpected token')) {
          errorLogged = true;
        }
      };

      const result = await getWordPressPost('fail-slug');
      assert.strictEqual(result, null);
      assert.strictEqual(errorLogged, true);
    } finally {
      global.fetch = localOriginalFetch;
      console.error = localOriginalConsoleError;
    }
  });

  test('should return parsed data even if fetch returns non-200 but json is valid (GraphQL error pattern)', async () => {
    process.env.VITE_WORDPRESS_URL = 'http://mock-wp.com/graphql';

    const localOriginalFetch = global.fetch;

    try {
      const mockData = { errors: [{ message: 'Some GraphQL Error' }] };
      global.fetch = async () => ({
        ok: false,
        status: 400,
        json: async () => mockData
      });

      const result = await getWordPressPost('fail-slug');
      assert.deepStrictEqual(result, mockData);
    } finally {
      global.fetch = localOriginalFetch;
    }
  });

  test('should return null and log error if json parsing fails', async () => {
    process.env.VITE_WORDPRESS_URL = 'http://mock-wp.com/graphql';

    const localOriginalFetch = global.fetch;
    const localOriginalConsoleError = console.error;

    try {
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
    } finally {
      global.fetch = localOriginalFetch;
      console.error = localOriginalConsoleError;
    }
  });

  test('should correctly fetch and return post data (success path)', async () => {
    process.env.VITE_WORDPRESS_URL = 'http://mock-success.com';
    const mockPostData = { data: { post: { title: 'Success Path', content: 'It works!' } } };

    const localOriginalFetch = global.fetch;
    try {
      global.fetch = async (url, options) => {
        assert.strictEqual(url, 'http://mock-success.com');
        assert.strictEqual(options.method, 'POST');
        return {
          json: async () => mockPostData
        };
      };

      const result = await getWordPressPost('success-slug');
      assert.deepStrictEqual(result, mockPostData);
    } finally {
      global.fetch = localOriginalFetch;
    }
  });

  test('should handle network failure gracefully (error path)', async () => {
    process.env.VITE_WORDPRESS_URL = 'http://mock-error.com';

    const localOriginalFetch = global.fetch;
    const localOriginalConsoleError = console.error;

    try {
      global.fetch = async () => {
        throw new TypeError('Failed to fetch');
      };

      let errorLogged = false;
      console.error = (msg, err) => {
        if (msg === 'WP Fetch Error:' && err.message === 'Failed to fetch') {
          errorLogged = true;
        }
      };

      const result = await getWordPressPost('error-slug');
      assert.strictEqual(result, null);
      assert.strictEqual(errorLogged, true);
    } finally {
      global.fetch = localOriginalFetch;
      console.error = localOriginalConsoleError;
    }
  });
});

describe('fetchPostsByCategory', () => {
  let originalFetch;
  let originalConsoleError;
  let originalConsoleWarn;
  let originalConsoleLog;

  beforeEach(() => {
    originalFetch = global.fetch;
    originalConsoleError = console.error;
    originalConsoleWarn = console.warn;
    originalConsoleLog = console.log;
    console.log = () => {}; // silence logs in tests
    fetchCache.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    console.error = originalConsoleError;
    console.warn = originalConsoleWarn;
    console.log = originalConsoleLog;
  });

  test('should return mapped posts if fetch is successful', async () => {
    global.fetch = async (url) => {
      if (url.includes('/categories?slug=apps')) {
        return {
          ok: true,
          json: async () => [{ id: 81, slug: 'apps' }]
        };
      }
      if (url.includes('/posts?categories=81')) {
        return {
          ok: true,
          json: async () => [
            {
              id: 1909,
              title: { rendered: 'Test Title' },
              excerpt: { rendered: 'Test Excerpt' },
              link: 'https://axim.us.com/test-link',
              date: '2026-03-25T13:14:48',
              _embedded: {
                'wp:featuredmedia': [{ source_url: 'https://example.com/image.png' }]
              }
            }
          ]
        };
      }
    };

    const result = await fetchPostsByCategory('apps', 1);
    assert.deepStrictEqual(result, [{
      id: 1909,
      title: 'Test Title',
      excerpt: 'Test Excerpt',
      link: 'https://axim.us.com/test-link',
      date: '2026-03-25T13:14:48',
      featuredImage: 'https://example.com/image.png'
    }]);
  });

  test('should return mock array and warn if category not found', async () => {
    const localOriginalFetch = global.fetch;
    const localOriginalConsoleWarn = console.warn;
    try {
      global.fetch = async (url) => {
        if (url.includes('/categories')) {
          return {
            ok: true,
            json: async () => []
          };
        }
      };

      let warnLogged = false;
      console.warn = (msg) => {
        if (msg.includes('No category found')) warnLogged = true;
      };

      const result = await fetchPostsByCategory('unknown', 2);
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].id, 1);
      assert.strictEqual(warnLogged, true);
    } finally {
      global.fetch = localOriginalFetch;
      console.warn = localOriginalConsoleWarn;
    }
  });

  test('should return mapped posts without featured image if not available', async () => {
    global.fetch = async (url) => {
      if (url.includes('/categories?slug=apps')) {
        return {
          ok: true,
          json: async () => [{ id: 81, slug: 'apps' }]
        };
      }
      if (url.includes('/posts?categories=81')) {
        return {
          ok: true,
          json: async () => [
            {
              id: 1910,
              title: { rendered: 'No Image Title' },
              excerpt: { rendered: 'No Image Excerpt' },
              link: 'https://axim.us.com/no-image-link',
              date: '2026-03-26T10:00:00'
            }
          ]
        };
      }
    };

    // test default limit of 5 implicitly here
    const result = await fetchPostsByCategory('apps');
    assert.deepStrictEqual(result, [{
      id: 1910,
      title: 'No Image Title',
      excerpt: 'No Image Excerpt',
      link: 'https://axim.us.com/no-image-link',
      date: '2026-03-26T10:00:00',
      featuredImage: null
    }]);
  });

  test('should return mock array and warn if category not found (null response)', async () => {
    const localOriginalFetch = global.fetch;
    const localOriginalConsoleWarn = console.warn;
    try {
      global.fetch = async (url) => {
        if (url.includes('/categories')) {
          return {
            ok: true,
            json: async () => null
          };
        }
      };

      let warnLogged = false;
      console.warn = (msg) => {
        if (msg.includes('No category found')) warnLogged = true;
      };

      const result = await fetchPostsByCategory('unknown', 1);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].id, 1);
      assert.strictEqual(warnLogged, true);
    } finally {
      global.fetch = localOriginalFetch;
      console.warn = localOriginalConsoleWarn;
    }
  });

  test('should return mock array and log error if fetch throws', async () => {
    const localOriginalFetch = global.fetch;
    const localOriginalConsoleError = console.error;
    try {
      global.fetch = async () => {
        throw new Error('Network error');
      };

      let errorLogged = false;
      console.error = (msg) => {
        if (msg.includes('Error fetching posts')) errorLogged = true;
      };

      const result = await fetchPostsByCategory('apps', 3);
      assert.strictEqual(result.length, 3);
      assert.strictEqual(result[0].id, 1);
      assert.strictEqual(errorLogged, true);
    } finally {
      global.fetch = localOriginalFetch;
      console.error = localOriginalConsoleError;
    }
  });

  test('should return mock array and log error if category fetch is not ok', async () => {
    const localOriginalFetch = global.fetch;
    const localOriginalConsoleError = console.error;
    try {
      global.fetch = async (url) => {
        if (url.includes('/categories?slug=apps')) {
          return {
            ok: false,
            statusText: 'Internal Server Error'
          };
        }
      };

      let errorLogged = false;
      console.error = (msg) => {
        if (msg.includes('Error fetching posts')) errorLogged = true;
      };

      const result = await fetchPostsByCategory('apps', 2);
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[0].id, 1);
      assert.strictEqual(errorLogged, true);
    } finally {
      global.fetch = localOriginalFetch;
      console.error = localOriginalConsoleError;
    }
  });

  test('should return mock array and log error if posts fetch is not ok', async () => {
    const localOriginalFetch = global.fetch;
    const localOriginalConsoleError = console.error;
    try {
      global.fetch = async (url) => {
        if (url.includes('/categories?slug=apps')) {
          return {
            ok: true,
            json: async () => [{ id: 81, slug: 'apps' }]
          };
        }
        if (url.includes('/posts?categories=81')) {
          return {
            ok: false,
            statusText: 'Not Found'
          };
        }
      };

      let errorLogged = false;
      console.error = (msg) => {
        if (msg.includes('Error fetching posts')) errorLogged = true;
      };

      const result = await fetchPostsByCategory('apps', 1);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].id, 1);
      assert.strictEqual(errorLogged, true);
    } finally {
      global.fetch = localOriginalFetch;
      console.error = localOriginalConsoleError;
    }
  });
});
