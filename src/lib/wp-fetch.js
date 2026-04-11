/**
 * Headless WordPress Fetch Utility
 * Adapted for Vite/React SPA fetching. 
 */

export async function getWordPressPost(slug) {
  // Use import.meta.env in Vite, fallback to process.env for Node.js tests
  const url = (import.meta.env && import.meta.env.VITE_WORDPRESS_URL) || process.env.VITE_WORDPRESS_URL;
  if (!url) return null;

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
            }
          }
        `,
        variables: { slug }
      }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("WP Fetch Error:", error);
    return null;
  }
}

/**
 * Fetch latest posts by category slug
 * @param {string} categorySlug - The slug of the category (e.g., 'apps')
 * @param {number} limit - Number of posts to fetch
 * @returns {Promise<Array>} Array of mapped posts
 */
export const fetchCache = new Map();

export async function fetchPostsByCategory(categorySlug, limit = 5) {
  const baseUrl = (import.meta.env && import.meta.env.VITE_WORDPRESS_REST_URL) || process.env.VITE_WORDPRESS_REST_URL;

  // Always try the root domain first, as we know the CORS plugin is installed there
  const urlsToTry = [
    "https://axim.us.com/wp-json/wp/v2",
    "https://wp.axim.us.com/wp-json/wp/v2"
  ];

  // If a custom env var is provided, add it to the front of the line
  if (baseUrl && !urlsToTry.includes(baseUrl)) {
    urlsToTry.unshift(baseUrl);
  }

  const cacheKey = `${categorySlug}-${limit}`;
  if (fetchCache.has(cacheKey)) {
    const cached = fetchCache.get(cacheKey);
    // basic 5-minute cache
    if (Date.now() - cached.timestamp < 300000) {
      return cached.data;
    }
  }

  try {
    // Inner function to attempt fetching
    const tryFetch = async (currentApiUrl) => {
      const ts = Date.now();
      // 1. Fetch category ID by slug
      const catRes = await fetch(`${currentApiUrl}/categories?slug=${categorySlug}&_ts=${ts}`, { signal: AbortSignal.timeout(10000) });
      if (!catRes.ok) throw new Error(`Failed to fetch category: ${catRes.statusText}`);
      const categories = await catRes.json();

      let postsRes;
      if (!categorySlug || !categories || categories.length === 0) {
        if (categorySlug) {
          console.warn(`No category found for slug: ${categorySlug}. Fetching latest posts as fallback.`);
        }
        // Fallback: Fetch all latest posts
        postsRes = await fetch(`${currentApiUrl}/posts?orderby=date&order=desc&per_page=${limit}&_embed&_ts=${ts}`, { signal: AbortSignal.timeout(10000) });
      } else {
        const categoryId = categories[0].id;
        // 2. Fetch posts by category ID, ordered by date descending
        postsRes = await fetch(`${currentApiUrl}/posts?categories=${categoryId}&orderby=date&order=desc&per_page=${limit}&_embed&_ts=${ts}`, { signal: AbortSignal.timeout(10000) });
      }

      if (!postsRes.ok) throw new Error(`Failed to fetch posts: ${postsRes.statusText}`);
      let posts = await postsRes.json();

      // If the category request returned 0 posts, automatically perform a fallback fetch
      if (posts.length === 0 && categorySlug) {
         console.warn(`Category '${categorySlug}' returned 0 posts. Fetching latest posts as fallback.`);
         postsRes = await fetch(`${currentApiUrl}/posts?orderby=date&order=desc&per_page=${limit}&_embed&_ts=${ts}`, { signal: AbortSignal.timeout(10000) });
         if (!postsRes.ok) throw new Error(`Failed to fetch fallback posts: ${postsRes.statusText}`);
         posts = await postsRes.json();
      }

      return posts;
    };

    let posts = null;
    let successfulUrl = null;
    let lastError = null;

    try {
      const fetchPromises = urlsToTry.map(async (url) => {
        try {
          const result = await tryFetch(url);
          return { posts: result, url };
        } catch (err) {
          console.warn(`[wp-fetch] Failed fetching from ${url}:`, err.message);
          throw err;
        }
      });

      const result = await Promise.any(fetchPromises);
      posts = result.posts;
      successfulUrl = result.url;
      console.info(`[wp-fetch] Successfully connected to WordPress API at: ${successfulUrl}`);
    } catch (err) {
      lastError = err;
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
        title: post.title?.rendered,
        excerpt: post.excerpt?.rendered,
        link: post.link, // CRITICAL: explicit absolute URL mapping
        date: post.date,
        featuredImage,
      };
    });

    fetchCache.set(cacheKey, { data: mappedPosts, timestamp: Date.now() });

    console.log(`[wp-fetch] Fetched ${mappedPosts.length} posts for category '${categorySlug}':`, mappedPosts);
    return mappedPosts;
  } catch (error) {
    console.error(`[wp-fetch] Error fetching posts for category '${categorySlug}':`, error.message || error);
    console.error(`[wp-fetch] Failed URL: ${urlsToTry.join(' or ')}`);

    // Fallback to cache on error
    if (fetchCache.has(cacheKey)) {
      console.warn(`[wp-fetch] Returning stale cached posts for '${categorySlug}' due to error.`);
      return fetchCache.get(cacheKey).data;
    }

    // Return empty array instead of mock data
    console.warn(`WordPress fetch failed at [${urlsToTry.join(', ')}]. Returning empty array.`);
    return [];
  }
}