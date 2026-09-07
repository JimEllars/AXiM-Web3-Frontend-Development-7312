import { HTMLRewriter } from 'html-rewriter-wasm';

const DEFAULT_IMAGE = '/axim-og-banner.png';
const BOT_REGEX = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Pinterest|Slackbot|TelegramBot|Discordbot|WhatsApp|Googlebot|bingbot/i;

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, '').trim();
}

function toSafeJson(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c');
}

async function fetchPagesOrigin(url) {
  const originUrl = new URL(url.toString());
  const originResponse = await fetch(originUrl, {
    headers: { 'x-axim-worker-bypass': 'true' }
  });
  return originResponse;
}

function cacheHeaders() {
  return {
    'Cache-Control': 'public, max-age=600',
    'Vary': 'User-Agent'
  };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isStaticAsset = url.pathname.includes('/assets/') ||
      /\.(js|css|wasm|png|jpg|jpeg|svg|webp|ico|json)$/i.test(url.pathname);

    if (isStaticAsset) {
      return fetchPagesOrigin(url);
    }

    const userAgent = (request.headers.get('user-agent') || '');
    const isBot = BOT_REGEX.test(userAgent);

    if (!isBot) {
      return fetchPagesOrigin(url);
    }

    // Serve from cache if available
    const cacheKey = request.url;
    const cached = await env.FRONTEND_SEO_CACHE.get(cacheKey);
    if (cached) {
      return new Response(cached, { status: 200, headers: cacheHeaders() });
    }

    const articleMatch = url.pathname.match(/^\/articles?\/([a-zA-Z0-9_-]+)$/);
    if (articleMatch) {
      const slug = articleMatch[1];

      let article;
      try {
        const wpUrl = typeof env.WP_API_URL !== 'undefined' ? env.WP_API_URL : 'https://wp.axim.us.com';
        const response = await fetch(
          `${wpUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`,
          { signal: AbortSignal.timeout(3000) }
        );
        if (response.ok) {
          [article] = await response.json();
        }
      } catch (error) {
        console.error('Article metadata fetch failed', error);
      }

      if (!article) {
        return fetchPagesOrigin(url);
      }

      const title = `${stripHtml(article.title?.rendered) || 'AXiM Intelligence Briefing'} | AXiM Systems`;
      const description = (stripHtml(article.excerpt?.rendered) || 'AXiM Development Intelligence Briefing').slice(0, 160);
      const image = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || DEFAULT_IMAGE;
      const canonicalUrl = url.origin + url.pathname;
      const schema = toSafeJson({
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        mainEntityOfPage: canonicalUrl,
        headline: title,
        description,
        image: [image],
        datePublished: article.date,
        dateModified: article.modified || article.date,
        author: {
          '@type': 'Person',
          name: article._embedded?.author?.[0]?.name || 'AXiM Development Editorial'
        },
        publisher: {
          '@type': 'Organization',
          name: 'AXiM Development',
          logo: { '@type': 'ImageObject', url: 'https://wp.axim.us.com/wp-content/uploads/2026/09/AXiM-Development-1200x400-layout684-business-axim-axim-infrastructure-1l9s8d3.webp' }
        }
      });

      const lightweightHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonicalUrl}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${canonicalUrl}">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${image}">
  <script type="application/ld+json">${schema}</script>
</head>
<body>
  <h1>${title}</h1>
  <p>${description}</p>
  <img src="${image}" alt="${title}">
</body>
</html>`;

      await env.FRONTEND_SEO_CACHE.put(cacheKey, lightweightHtml, { expirationTtl: 600 });
      return new Response(lightweightHtml, { status: 200, headers: { 'Content-Type': 'text/html', ...cacheHeaders() } });
    }

    // Default handling for other pages if bot
    const rawResponse = await fetchPagesOrigin(url);
    return rawResponse;
  }
};
