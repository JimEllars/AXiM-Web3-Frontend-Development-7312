/* global HTMLRewriter */

const BOT_AGENTS = [
  'twitterbot', 'facebookexternalhit', 'linkedinbot', 'slackbot',
  'whatsapp', 'telegrambot', 'discordbot', 'skypeuripreview',
  'googlebot', 'bingbot', 'applebot', 'gptbot', 'chatgpt-user',
  'perplexitybot', 'claudebot'
];

const DEFAULT_IMAGE = 'https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp';
const PAGES_ORIGIN = 'https://axim-web3-frontend-development-7312.pages.dev';

function stripHtml(value = '') {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function toSafeJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function cacheHeaders() {
  return {
    'Content-Type': 'text/html; charset=UTF-8',
    'Cache-Control': 'public, max-age=300, s-maxage=86400'
  };
}

function fetchPagesOrigin(url) {
  return fetch(new URL(`${url.pathname}${url.search}`, PAGES_ORIGIN));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isStaticAsset = url.pathname.includes('/assets/') ||
      /\.(js|css|wasm|png|jpg|jpeg|svg|webp|ico|json)$/i.test(url.pathname);

    if (isStaticAsset) {
      return fetchPagesOrigin(url);
    }

    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
    const isBot = BOT_AGENTS.some((bot) => userAgent.includes(bot));

    if (!isBot || !url.pathname.startsWith('/article/')) {
      return fetchPagesOrigin(url);
    }

    const slug = url.pathname.slice('/article/'.length).split('/')[0];
    if (!slug) {
      return fetchPagesOrigin(url);
    }

    const cacheKey = request.url;
    const cached = await env.FRONTEND_SEO_CACHE.get(cacheKey);
    if (cached) {
      return new Response(cached, { status: 200, headers: cacheHeaders() });
    }

    let article;
    try {
      const response = await fetch(
        `https://wp.axim.us.com/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`,
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
    const description = (stripHtml(article.excerpt?.rendered) || 'AXiM Systems Intelligence Briefing').slice(0, 160);
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
        name: article._embedded?.author?.[0]?.name || 'AXiM Systems Editorial'
      },
      publisher: {
        '@type': 'Organization',
        name: 'AXiM Systems',
        logo: { '@type': 'ImageObject', url: 'https://wp.axim.us.com/wp-content/uploads/2025/06/12.png' }
      }
    });

    const rawResponse = await fetchPagesOrigin(url);
    const rewrittenResponse = new HTMLRewriter()
      .on('title', { element(element) { element.setInnerContent(title); } })
      .on('meta[name="description"]', { element(element) { element.setAttribute('content', description); } })
      .on('link[rel="canonical"]', { element(element) { element.setAttribute('href', canonicalUrl); } })
      .on('meta[property="og:url"]', { element(element) { element.setAttribute('content', canonicalUrl); } })
      .on('meta[property="og:title"]', { element(element) { element.setAttribute('content', title); } })
      .on('meta[property="og:description"]', { element(element) { element.setAttribute('content', description); } })
      .on('meta[property="og:image"]', { element(element) { element.setAttribute('content', image); } })
      .on('meta[property="twitter:url"]', { element(element) { element.setAttribute('content', canonicalUrl); } })
      .on('meta[property="twitter:title"]', { element(element) { element.setAttribute('content', title); } })
      .on('meta[property="twitter:description"]', { element(element) { element.setAttribute('content', description); } })
      .on('meta[property="twitter:image"]', { element(element) { element.setAttribute('content', image); } })
      .on('head', {
        element(element) {
          element.append(`<script type="application/ld+json">${schema}</script>`, { html: true });
        }
      })
      .transform(rawResponse);

    const html = await rewrittenResponse.text();
    await env.FRONTEND_SEO_CACHE.put(cacheKey, html, { expirationTtl: 86400 });
    return new Response(html, { status: rawResponse.status, headers: cacheHeaders() });
  }
};
