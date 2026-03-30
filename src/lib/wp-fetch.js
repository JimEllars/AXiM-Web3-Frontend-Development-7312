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