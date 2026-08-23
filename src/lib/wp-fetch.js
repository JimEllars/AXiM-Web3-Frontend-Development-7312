import { useAximStore } from '../store/useAximStore';
import { logTelemetry } from './telemetry';

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


const FALLBACK_ARTICLES = [
  {
    id: 'fallback-1',
    slug: 'ai-grid-containment-proof',
    title: "AI's Grid Impact & Sovereign Energy Nodes",
    excerpt: "Exploring the intersection of decentralized power generation and autonomous compute nodes across modern smart grids.",
    link: '/articles',
    date: new Date().toISOString(),
    featuredImage: 'https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp'
  },
  {
    id: 'fallback-2',
    slug: 'autonomous-agent-protocols',
    title: 'Autonomous Agent Protocols in Web3 Workflows',
    excerpt: 'How decentralized execution lanes enable zero-latency automation for enterprise systems.',
    link: '/articles',
    date: new Date().toISOString(),
    featuredImage: 'https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp'
  }
];


export async function getWordPressPost(slug) {
  // Use import.meta.env in Vite, fallback to process.env for Node.js tests
  const url = 'https://wp.axim.us.com/graphql';
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
      const res = await fetch(`https://wp.axim.us.com/wp-json/wp/v2/categories?slug=${slug}&_ts=${ts}`, {
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
export async function fetchPostsByCategory(categorySlug, limit = 5, page = 1) {


  const cacheKey = `cat-posts-${categorySlug}-${limit}-page-${page}`;
  const existing = fetchCache.get(cacheKey);

  if (existing && (Date.now() - existing.timestamp < 300000)) {
    if (existing.promise) return existing.promise;
    return existing.data;
  }

  const fetchPromise = (async () => {
    try {
      // Inner function to attempt fetching
      const tryFetch = async () => {
        const ts = Date.now();

        // 1. Fetch category ID by slug (utilizing cache to prevent N+1)
        const categoryId = await getCategoryId('https://wp.axim.us.com', categorySlug);

        let postsRes;
        let posts = [];

        if (!categorySlug) {
          postsRes = await fetch(`https://wp.axim.us.com/wp-json/wp/v2/posts?orderby=date&order=desc&per_page=${limit}&page=${page}&_embed=1&_ts=${ts}`, { signal: AbortSignal.timeout(10000) });
          if (!postsRes.ok) throw new Error(`Failed to fetch posts: ${postsRes.statusText}`);
          posts = await postsRes.json();
        } else if (!categoryId) {
          // No category found, fallback to fetching recent posts

          postsRes = await fetch(`https://wp.axim.us.com/wp-json/wp/v2/posts?orderby=date&order=desc&per_page=${limit}&page=${page}&_embed=1&_ts=${ts}`, { signal: AbortSignal.timeout(10000) });
          if (!postsRes.ok) throw new Error(`Failed to fetch fallback posts: ${postsRes.statusText}`);
          posts = await postsRes.json();
        } else {
          // 2. Fetch posts by category ID, ordered by date descending
          postsRes = await fetch(`https://wp.axim.us.com/wp-json/wp/v2/posts?categories=${categoryId}&orderby=date&order=desc&per_page=${limit}&page=${page}&_embed=1&_ts=${ts}`, { signal: AbortSignal.timeout(10000) });
          if (!postsRes.ok) throw new Error(`Failed to fetch posts: ${postsRes.statusText}`);
          posts = await postsRes.json();

          if (!posts || posts.length === 0) {

            postsRes = await fetch(`https://wp.axim.us.com/wp-json/wp/v2/posts?orderby=date&order=desc&per_page=${limit}&page=${page}&_embed=1&_ts=${ts}`, { signal: AbortSignal.timeout(10000) });
            if (!postsRes.ok) throw new Error(`Failed to fetch fallback posts: ${postsRes.statusText}`);
            posts = await postsRes.json();
          }
        }

        return posts;
      };

      let posts = null;
      let successfulUrl = null;

      try {
        posts = await tryFetch();
        console.info(`[wp-fetch] Successfully connected to WordPress API via proxy`);
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
      return FALLBACK_ARTICLES;
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
  if (params.forceWarmup) {
    delete params.forceWarmup;
  } else {
    // Allow edge caching
  }

  // Remove null/undefined values
  const cleanParams = {};
  for (const key in params) {
    if (params[key] !== null && params[key] !== undefined && params[key] !== 'null') {
      cleanParams[key] = params[key];
    }
  }

  // Prevent duplicate _embed=1 if it was passed in params
  if (cleanParams['_embed'] === 1 || cleanParams['_embed'] === '1') {
      delete cleanParams['_embed'];
  }

  const queryParams = new URLSearchParams(cleanParams).toString();
  const endpoint = `/wp-json/wp/v2/posts?_embed=1${queryParams ? '&' + queryParams : ''}`;
  const fetchUrl = `https://wp.axim.us.com${endpoint}`;

  let retryCount = 0;
  while (retryCount < 2) {
    try {
      let res = await fetch(fetchUrl, {
        signal: AbortSignal.timeout(8000)
      });

      if (!res || !res.ok) throw new Error('Failed to fetch WordPress posts');
      return await res.json();
    } catch (error) {
      if (retryCount === 0) {
        retryCount++;
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      } else {
        console.error('[WP_FETCH] Fetch failed. Loading cached fallback data.', error);
        logTelemetry('wp_edge_proxy_retry_failed', { endpoint: fetchUrl });
        useAximStore.getState().addToast("Live feed unavailable. Loading cached data.", "warning");
        return FALLBACK_ARTICLES;
      }
    }
  }
};
