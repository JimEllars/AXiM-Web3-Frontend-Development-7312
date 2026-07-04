import { useAximStore } from '../store/useAximStore';

const dummyArticles = [
  {
    id: 9991,
    slug: 'web3-infrastructure-scaling',
    title: { rendered: 'Web3 Infrastructure Scaling' },
    excerpt: { rendered: 'An analysis of decentralized protocol throughput and the required edge architecture for enterprise adoption.' },
    date: new Date().toISOString(),
    link: 'https://axim.us.com/article/web3-infrastructure-scaling',
    _embedded: {
      'wp:featuredmedia': [{ source_url: 'https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp' }]
    }
  },
  {
    id: 9992,
    slug: 'autonomous-legal-agents',
    title: { rendered: 'Autonomous Legal Agents in Tech' },
    excerpt: { rendered: 'How generative models and vector embeddings are reducing the overhead of corporate compliance and dispute resolution.' },
    date: new Date().toISOString(),
    link: 'https://axim.us.com/article/autonomous-legal-agents',
    _embedded: {
      'wp:featuredmedia': [{ source_url: 'https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp' }]
    }
  },
  {
    id: 9993,
    slug: 'decentralized-identity-auth',
    title: { rendered: 'Zero-Trust and Decentralized Auth' },
    excerpt: { rendered: 'Moving beyond OAuth: The role of cryptographic wallet signatures in securing modern enterprise data pipelines.' },
    date: new Date().toISOString(),
    link: 'https://axim.us.com/article/decentralized-identity-auth',
    _embedded: {
      'wp:featuredmedia': [{ source_url: 'https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp' }]
    }
  }
];
export const fetchCategoryBySlug = async (slug) => {
  try {
    const res = await fetch(`https://wp.axim.us.com/wp-json/wp/v2/categories?slug=${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data?.length > 0 ? data[0].id : null;
  } catch (error) {
    console.error(`[WP_FETCH] Failed to resolve category slug: ${slug}`);
    return null;
  }
};


export const getFeaturedImage = (article) => {
  if (!article) return null;

  // 1. Primary: Native WP Embed
  const media = article._embedded?.['wp:featuredmedia']?.[0];
  let url = media?.source_url ||
            media?.media_details?.sizes?.large?.source_url ||
            media?.media_details?.sizes?.full?.source_url;

  // 2. Secondary: Hunt for SEO/Plugin "Ghost" Fields if _embedded was stripped
  if (!url) {
    url = article.yoast_head_json?.og_image?.[0]?.url ||
          article.jetpack_featured_media_url ||
          article.featured_image_src ||
          article.featured_media_src_url ||
          null;
  }

  // 3. Force HTTPS to avoid mixed-content blocks
  return url ? url.replace('http:', 'https:') : null;
};

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
          postsRes = await fetch(`${currentApiUrl}/posts?orderby=date&order=desc&per_page=${limit}&_embed=1&_ts=${ts}`, { signal: AbortSignal.timeout(10000) });
          if (!postsRes.ok) throw new Error(`Failed to fetch posts: ${postsRes.statusText}`);
          posts = await postsRes.json();
        } else if (!categoryId) {
          // No category found, fallback to fetching recent posts

          postsRes = await fetch(`${currentApiUrl}/posts?orderby=date&order=desc&per_page=${limit}&_embed=1&_ts=${ts}`, { signal: AbortSignal.timeout(10000) });
          if (!postsRes.ok) throw new Error(`Failed to fetch fallback posts: ${postsRes.statusText}`);
          posts = await postsRes.json();
        } else {
          // 2. Fetch posts by category ID, ordered by date descending
          postsRes = await fetch(`${currentApiUrl}/posts?categories=${categoryId}&orderby=date&order=desc&per_page=${limit}&_embed=1&_ts=${ts}`, { signal: AbortSignal.timeout(10000) });
          if (!postsRes.ok) throw new Error(`Failed to fetch posts: ${postsRes.statusText}`);
          posts = await postsRes.json();

          if (!posts || posts.length === 0) {

            postsRes = await fetch(`${currentApiUrl}/posts?orderby=date&order=desc&per_page=${limit}&_embed=1&_ts=${ts}`, { signal: AbortSignal.timeout(10000) });
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
        let featuredImage = getFeaturedImage(post);

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


export const fetchPosts = async (params = {}) => {
  try {
    params._ts = Date.now();
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/wp-json/wp/v2/posts?_embed=1&${queryParams}`;

    const proxyUrl = import.meta.env?.VITE_WP_PROXY_URL || 'https://wp-proxy.axim.us.com';

    // First try the proxy route
    let res;
    try {
        res = await fetch(`${proxyUrl}?endpoint=${encodeURIComponent(endpoint)}`, {
          signal: AbortSignal.timeout(8000)
        });
    } catch (proxyErr) {
        // Fallback to direct fetch if proxy URL is dead (like local dev without running proxy)
        console.warn("[WP_FETCH] Proxy failed, trying direct WP connection.");
        res = await fetch(`https://wp.axim.us.com${endpoint}`, {
          signal: AbortSignal.timeout(8000)
        });
    }

    if (!res || !res.ok) throw new Error('Failed to fetch WordPress posts');
    return await res.json();
  } catch (error) {
    console.error('[WP_FETCH] Fetch failed. Loading cached fallback data.', error);
    useAximStore.getState().addToast("Live feed unavailable. Loading cached data.", "warning");
    return dummyArticles;
  }
};
