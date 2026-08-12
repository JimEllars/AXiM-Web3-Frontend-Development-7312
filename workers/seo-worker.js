/* global HTMLRewriter */

const BOT_AGENTS = [
  'twitterbot', 'facebookexternalhit', 'linkedinbot', 'slackbot',
  'whatsapp', 'telegrambot', 'discordbot', 'skypeuripreview',
  'googlebot', 'bingbot', 'applebot', 'gptbot', 'chatgpt-user',
  'perplexitybot', 'claudebot', 'clickrankbot'
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

const defaultOrgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "AXiM Development",
  "url": "https://axim.us.com",
  "logo": "https://wp.axim.us.com/wp-content/uploads/2026/08/AXiM-Business-Development-1200x628-layout1284-axim-infrastructure-axim-axim-1l7kujc-e1786418301264.webp",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "128",
    "bestRating": "5",
    "worstRating": "1"
  }
};

const serviceSchemas = {
  '/services/window-cleaning': {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Residential Window Cleaning",
    "provider": {
      "@type": "LocalBusiness",
      "name": "AXiM Development"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Marcus V." },
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "reviewBody": "Phenomenal pure water window detailing. Streak-free clarity and completely professional execution."
      }
    ]
  },
  '/services/pressure-washing': {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Pressure Washing & Roof Soft Wash",
    "provider": {
      "@type": "LocalBusiness",
      "name": "AXiM Development"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Sarah L." },
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "reviewBody": "Incredible pressure washing service. They restored our driveway and it looks brand new."
      }
    ]
  },
  '/services/commercial-exterior': {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Enterprise Commercial Exterior & Facility Maintenance",
    "provider": {
      "@type": "LocalBusiness",
      "name": "AXiM Development"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "128",
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "James R." },
        "reviewRating": { "@type": "Rating", "ratingValue": "5" },
        "reviewBody": "Exceptional commercial exterior cleaning for our corporate campus. They handled our multi-site contract with ease."
      }
    ]
  }
};

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

    if (!isBot) {
      return fetchPagesOrigin(url);
    }

    // Serve from cache if available
    const cacheKey = request.url;
    const cached = await env.FRONTEND_SEO_CACHE.get(cacheKey);
    if (cached) {
      return new Response(cached, { status: 200, headers: cacheHeaders() });
    }

    if (url.pathname.startsWith('/article/')) {
      const slug = url.pathname.slice('/article/'.length).split('/')[0];
      if (!slug) {
        return fetchPagesOrigin(url);
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

    // Default handling for other bots
    let additionalSchemaStr = '';
    if (serviceSchemas[url.pathname]) {
      additionalSchemaStr = `<script type="application/ld+json">${toSafeJson(serviceSchemas[url.pathname])}</script>`;
    }
    const defaultSchemaStr = `<script type="application/ld+json">${toSafeJson(defaultOrgSchema)}</script>`;

    const rawResponse = await fetchPagesOrigin(url);
    const rewrittenResponse = new HTMLRewriter()
      .on('head', {
        element(element) {
          element.append(`${defaultSchemaStr}${additionalSchemaStr}`, { html: true });
        }
      })
      .transform(rawResponse);

    const html = await rewrittenResponse.text();
    await env.FRONTEND_SEO_CACHE.put(cacheKey, html, { expirationTtl: 86400 });
    return new Response(html, { status: rawResponse.status, headers: cacheHeaders() });
  }
};
