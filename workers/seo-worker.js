/* global HTMLRewriter */
// workers/seo-worker.js

/**
 * AXiM Edge SEO Interceptor
 * Intercepts social media bot requests to /article/* and dynamically injects Open Graph meta tags.
 */

const BOT_AGENTS = [
  'twitterbot', 'facebookexternalhit', 'linkedinbot', 'slackbot',
  'whatsapp', 'telegrambot', 'discordbot', 'skypeuripreview'
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

    // Determine if the request is from a social media crawler
    const isBot = BOT_AGENTS.some(bot => userAgent.includes(bot));

    // Only intercept Bot traffic hitting an Article route
    if (isBot && url.pathname.startsWith('/article/')) {
      const slug = url.pathname.replace('/article/', '').replace('/', '');

      try {
        // Fetch specific article data from the Headless CMS
        const wpRes = await fetch(`https://wp.axim.us.com/wp-json/wp/v2/posts?slug=${slug}&_embed=1`);
        const wpData = await wpRes.json();

        if (wpData && wpData.length > 0) {
          const article = wpData[0];
          const cleanTitle = article.title.rendered.replace(/<[^>]+>/g, '') + " | AXiM Systems";
          const cleanDesc = article.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 160) + "...";
          const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp';

          // Fetch the raw SPA index.html
          const rawResponse = await fetch(request);

          // Use HTMLRewriter to inject the accurate metadata in-flight
          return new HTMLRewriter()
            .on('title', { element(e) { e.setInnerContent(cleanTitle); } })
            .on('meta[property="og:title"]', { element(e) { e.setAttribute('content', cleanTitle); } })
            .on('meta[name="twitter:title"]', { element(e) { e.setAttribute('content', cleanTitle); } })
            .on('meta[property="og:description"]', { element(e) { e.setAttribute('content', cleanDesc); } })
            .on('meta[property="og:image"]', { element(e) { e.setAttribute('content', imageUrl); } })
            .on('meta[name="twitter:image"]', { element(e) { e.setAttribute('content', imageUrl); } })
            .transform(rawResponse);
        }
      } catch (err) {
        console.error("Edge Intercept Failed:", err);
      }
    }

    // If human or non-article route, pass through normally
    return fetch(request);
  }
};
