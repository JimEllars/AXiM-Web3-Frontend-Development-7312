/**
 * Headless WordPress Fetch Utility
 * Adapted for Vite/React SPA fetching. 
 */

export async function getWordPressPost(slug) {
  // Use import.meta.env in Vite, fallback to process.env for Node.js tests
  const url = import.meta.env ? import.meta.env.VITE_WORDPRESS_URL : process.env.VITE_WORDPRESS_URL;
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
  const baseUrl = import.meta.env ? import.meta.env.VITE_WORDPRESS_REST_URL : process.env.VITE_WORDPRESS_REST_URL;
  const apiUrl = baseUrl || "https://axim.us.com/wp-json/wp/v2";

  const cacheKey = `${categorySlug}-${limit}`;
  if (fetchCache.has(cacheKey)) {
    const cached = fetchCache.get(cacheKey);
    // basic 5-minute cache
    if (Date.now() - cached.timestamp < 300000) {
      console.log(`[wp-fetch] Returning cached posts for '${categorySlug}'`);
      return cached.data;
    }
  }

  try {
    // 1. Fetch category ID by slug
    const catRes = await fetch(`${apiUrl}/categories?slug=${categorySlug}`, { signal: AbortSignal.timeout(10000) });
    if (!catRes.ok) throw new Error(`Failed to fetch category: ${catRes.statusText}`);
    const categories = await catRes.json();

    if (!categories || categories.length === 0) {
      console.warn(`No category found for slug: ${categorySlug}`);
      return [];
    }
    const categoryId = categories[0].id;

    // 2. Fetch posts by category ID, ordered by date descending
    const postsRes = await fetch(`${apiUrl}/posts?categories=${categoryId}&orderby=date&order=desc&per_page=${limit}&_embed`, { signal: AbortSignal.timeout(10000) });
    if (!postsRes.ok) throw new Error(`Failed to fetch posts: ${postsRes.statusText}`);
    const posts = await postsRes.json();

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

    // Fallback to cache on error
    if (fetchCache.has(cacheKey)) {
      console.warn(`[wp-fetch] Returning stale cached posts for '${categorySlug}' due to error.`);
      return fetchCache.get(cacheKey).data;
    }
    return [];
  }
}