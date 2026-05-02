/**
 * Headless WordPress Fetch Utility
 * Adapted for Vite/React SPA fetching. 
 */

export const fetchCache = new Map();

export async function getWordPressPost(slug) {
  // Use import.meta.env in Vite, fallback to process.env for Node.js tests
  const url = (import.meta.env && import.meta.env.VITE_WORDPRESS_URL) || process.env.VITE_WORDPRESS_URL;
  if (!url) return null;

  const cacheKey = `gql-post-${slug}`;
  const existingCache = fetchCache.get(cacheKey);

  if (existingCache) {
    // 5-minute cache
    if (Date.now() - existingCache.timestamp < 300000) {
      if (existingCache.promise) return existingCache.promise;
      return existingCache.data;
    }
  }

  const fetchPromise = (async () => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `
            query GetPost($slug: ID!) {
              post(id: $slug, idType: SLUG) {
                title
                content
                featuredImage {
                  node {
                    sourceUrl
                  }
                }
              }
            }
          `,
          variables: { slug }
        }),
      });

      const data = await res.json();

      fetchCache.set(cacheKey, { data, timestamp: Date.now() });

      return data;
    } catch (error) {


      if (existingCache && existingCache.data) {

        // Revert cache to stale state so future calls can also try to use it if needed, or delete it?
        // Let's restore the stale cache without the promise
        fetchCache.set(cacheKey, { data: existingCache.data, timestamp: existingCache.timestamp });
        return existingCache.data;
      }

      fetchCache.delete(cacheKey);
      return null;
    }
  })();

  fetchCache.set(cacheKey, {
    promise: fetchPromise,
    timestamp: Date.now(),
    data: existingCache ? existingCache.data : undefined
  });

  return fetchPromise;
}

/**
 * Internal helper to fetch and cache category ID by slug.
 * Prevents redundant N+1 requests when fetching posts by category.
 */
async function getCategoryId(apiUrl, slug) {
  if (!slug || !apiUrl) return null;

  // We use a global cache key for the slug because all AXiM WordPress URLs
  // are expected to share the same database and IDs.
  const cacheKey = `cat-id-${slug}`;
  const existing = fetchCache.get(cacheKey);

  if (existing && (Date.now() - existing.timestamp < 300000)) {
    if (existing.promise) return existing.promise;
    return existing.data;
  }

  const fetchPromise = (async () => {
    try {
      const ts = Date.now();
      // Normalize URL to prevent cache misses due to trailing slashes
      const normalizedApiUrl = apiUrl.replace(/\/$/, '');
      const res = await fetch(`${normalizedApiUrl}/categories?slug=${slug}&_ts=${ts}`, {
        signal: AbortSignal.timeout(10000)
      });

      if (!res.ok) return null;

      const categories = await res.json();
      const id = (categories && Array.isArray(categories) && categories.length > 0) ? categories[0].id : null;

      fetchCache.set(cacheKey, { data: id, timestamp: Date.now() });
      return id;
    } catch (error) {

      // Fallback to stale data if available on error
      if (existing && existing.data !== undefined) {
        fetchCache.set(cacheKey, { data: existing.data, timestamp: existing.timestamp });
        return existing.data;
      }
      fetchCache.delete(cacheKey);
      return null;
    }
  })();

  fetchCache.set(cacheKey, {
    promise: fetchPromise,
    timestamp: Date.now(),
    data: existing ? existing.data : undefined
  });

  return fetchPromise;
}

/**
 * Fetch latest posts by category slug
 * @param {string} categorySlug - The slug of the category (e.g., 'apps')
 * @param {number} limit - Number of posts to fetch
 * @returns {Promise<Array>} Array of mapped posts
 */
export async function fetchPostsByCategory(categorySlug, limit = 5) {
  const baseUrl = (import.meta.env && import.meta.env.VITE_WORDPRESS_REST_URL) || process.env.VITE_WORDPRESS_REST_URL;

  // Always try the wp domain first
  const urlsToTry = [
    "https://wp.axim.us.com/wp-json/wp/v2",
    "https://axim.us.com/wp-json/wp/v2"
  ];

  // If a custom env var is provided, add it to the front of the line
  if (baseUrl && !urlsToTry.includes(baseUrl)) {
    urlsToTry.unshift(baseUrl);
  }

  const cacheKey = `cat-posts-${categorySlug}-${limit}`;
  const existing = fetchCache.get(cacheKey);

  if (existing && (Date.now() - existing.timestamp < 300000)) {
    if (existing.promise) return existing.promise;
    return existing.data;
  }

  const fetchPromise = (async () => {
    try {
      // Inner function to attempt fetching
      const tryFetch = async (currentApiUrl) => {
        const ts = Date.now();

        // 1. Fetch category ID by slug (utilizing cache to prevent N+1)
        const categoryId = await getCategoryId(currentApiUrl, categorySlug);

        let postsRes;
        let posts = [];

        if (!categorySlug) {
          postsRes = await fetch(`${currentApiUrl}/posts?orderby=date&order=desc&per_page=${limit}&_embed&_ts=${ts}`, { signal: AbortSignal.timeout(10000) });
          if (!postsRes.ok) throw new Error(`Failed to fetch posts: ${postsRes.statusText}`);
          posts = await postsRes.json();
        } else if (!categoryId) {
          // No category found, fallback to fetching recent posts

          postsRes = await fetch(`${currentApiUrl}/posts?orderby=date&order=desc&per_page=${limit}&_embed&_ts=${ts}`, { signal: AbortSignal.timeout(10000) });
          if (!postsRes.ok) throw new Error(`Failed to fetch fallback posts: ${postsRes.statusText}`);
          posts = await postsRes.json();
        } else {
          // 2. Fetch posts by category ID, ordered by date descending
          postsRes = await fetch(`${currentApiUrl}/posts?categories=${categoryId}&orderby=date&order=desc&per_page=${limit}&_embed&_ts=${ts}`, { signal: AbortSignal.timeout(10000) });
          if (!postsRes.ok) throw new Error(`Failed to fetch posts: ${postsRes.statusText}`);
          posts = await postsRes.json();

          if (!posts || posts.length === 0) {

            postsRes = await fetch(`${currentApiUrl}/posts?orderby=date&order=desc&per_page=${limit}&_embed&_ts=${ts}`, { signal: AbortSignal.timeout(10000) });
            if (!postsRes.ok) throw new Error(`Failed to fetch fallback posts: ${postsRes.statusText}`);
            posts = await postsRes.json();
          }
        }

        return posts;
      };

      let posts = null;
      let successfulUrl = null;

      try {
        const fetchPromises = urlsToTry.map(async (url) => {
          try {
            const result = await tryFetch(url);
            return { posts: result, url };
          } catch (err) {

            throw err;
          }
        });

        const result = await Promise.any(fetchPromises);
        posts = result.posts;
        successfulUrl = result.url;
        console.info(`[wp-fetch] Successfully connected to WordPress API at: ${successfulUrl}`);
      } catch (err) {
        throw new Error("All WordPress API endpoints failed or were blocked by CORS.");
      }

      // 3. Map the properties and ensure the explicit absolute URL link is included
      const mappedPosts = posts.map(post => {
        // Get featured image if available
        let featuredImage = null;
        if (post._embedded && post._embedded['wp:featuredmedia'] && post._embedded['wp:featuredmedia'][0]) {
          featuredImage = post._embedded['wp:featuredmedia'][0].source_url;
        }

        return {
          id: post.id,
          slug: post.slug,
          title: post.title?.rendered,
          excerpt: post.excerpt?.rendered,
          link: post.link, // CRITICAL: explicit absolute URL mapping
          date: post.date,
          featuredImage,
        };
      });

      fetchCache.set(cacheKey, { data: mappedPosts, timestamp: Date.now() });

      return mappedPosts;
    } catch (error) {
      if (existing && existing.data) {
        fetchCache.set(cacheKey, { data: existing.data, timestamp: existing.timestamp });
        return existing.data;
      }
      fetchCache.delete(cacheKey);
      return [];
    }
  })();

  fetchCache.set(cacheKey, {
    promise: fetchPromise,
    timestamp: Date.now(),
    data: existing ? existing.data : undefined
  });

  return fetchPromise;
}
