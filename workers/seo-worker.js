/* global HTMLRewriter */
const DEFAULT_IMAGE = '/axim-og-banner.png';

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, '').trim();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function fetchPagesOrigin(request, env) {
  if (!env.PAGES_ORIGIN) {
    throw new Error('PAGES_ORIGIN is not configured');
  }

  const origin = new URL(env.PAGES_ORIGIN);
  const requestedUrl = new URL(request.url);
  origin.pathname = requestedUrl.pathname;
  origin.search = requestedUrl.search;

  return fetch(new Request(origin, request));
}

class RootInjector {
  constructor(fallbackContent) {
    this.fallbackContent = fallbackContent;
  }
  element(element) {
    element.append(this.fallbackContent, { html: true });
  }
}

class CanonicalInjector {
  constructor(canonicalUrl) {
    this.canonicalUrl = canonicalUrl;
  }
  element(element) {
    element.append(`<link rel="canonical" href="${this.canonicalUrl}" />`, { html: true });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const acceptHeader = request.headers.get('accept') || '';
    const isHtmlRequest = acceptHeader.includes('text/html');

    // Static assets bypass everything
    const isStaticAsset = url.pathname.includes('/assets/') ||
      /\.(js|css|wasm|png|jpg|jpeg|svg|webp|ico|json|txt|xml)$/i.test(url.pathname);

    if (isStaticAsset || !isHtmlRequest) {
      return fetchPagesOrigin(request, env);
    }

    // Trailing slash normalization for articles
    if (url.pathname.match(/^\/article\/[a-zA-Z0-9_-]+\/$/)) {
      const newUrl = new URL(url);
      newUrl.pathname = url.pathname.slice(0, -1);
      return Response.redirect(newUrl.toString(), 301);
    }

    // We only want HTML rewrites on actual text/html routes

    // Check against routes
    const validRoutes = [
      '/', '/articles', '/business', '/personal', '/games', '/ai', '/tech', '/store',
      '/partners', '/partners/make', '/partners/powur-solar', '/partners/powur-join', '/partners/chatbase',
      '/services', '/services/window-cleaning', '/services/pressure-washing', '/services/commercial-exterior',
      '/consultation', '/support', '/auth', '/terms', '/dashboard/access-denied', '/early-access',
      '/profile', '/admin'
    ];

    let isArticleRoute = false;
    let articleSlug = null;
    const articleMatch = url.pathname.match(/^\/article\/([a-zA-Z0-9_-]+)$/);
    if (articleMatch) {
      isArticleRoute = true;
      articleSlug = articleMatch[1];
    }

    const isValidRoute = validRoutes.includes(url.pathname) || isArticleRoute;
    let article;

    if (isArticleRoute) {
      try {
        const wpUrl = typeof env.WP_API_URL !== 'undefined' ? env.WP_API_URL : 'https://wp.axim.us.com';
        const response = await fetch(
          `${wpUrl}/wp-json/wp/v2/posts?slug=${encodeURIComponent(articleSlug)}&_embed=1`,
          { signal: AbortSignal.timeout(3000) }
        );
        if (response.ok) {
          const json = await response.json();
          if (json && json.length > 0) {
            article = json[0];
          }
        }
      } catch (error) {
        console.error('Article metadata fetch failed', error);
      }
    }

    if (!isValidRoute && !article) {
      // Return 404
      return new Response(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Page Not Found | AXiM Systems</title>
  <meta name="robots" content="noindex, nofollow">
</head>
<body class="bg-[#050505] text-white">
  <div id="root">
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <a href="/">Return Home</a>
  </div>
</body>
</html>`, { status: 404, headers: { 'Content-Type': 'text/html' } });
    }

    const rawResponse = await fetchPagesOrigin(request, env);
    if (!rawResponse.ok) {
       return rawResponse;
    }

    // Inject fallback and canonical
    const fallbackTitle = isArticleRoute && article ? escapeHtml(`${stripHtml(article.title?.rendered)}`) : 'AXiM Systems Hub';
    const fallbackDesc = isArticleRoute && article ? escapeHtml((stripHtml(article.excerpt?.rendered)).slice(0, 250)) : 'AXiM Development provides practical automation, decentralized infrastructure, operational intelligence, and business tools.';
    const canonicalUrl = url.origin + url.pathname;

    const fallbackHtml = `
      <div style="display:none;" id="seo-fallback">
        <h1>${fallbackTitle}</h1>
        <p>${fallbackDesc}</p>
        <nav>
          <a href="/services">Services</a> |
          <a href="/articles">Articles</a> |
          <a href="/tech">Tech</a> |
          <a href="/business">Business</a> |
          <a href="/terms">Terms</a>
        </nav>
      </div>
    `;

    let rewriter = new HTMLRewriter()
      .on('#root', new RootInjector(fallbackHtml))
      .on('head', new CanonicalInjector(canonicalUrl));

    // Remove the old canonical if present
    rewriter = rewriter.on('head link[rel="canonical"]', {
      element(element) {
        // If it's not the one we just injected (this is a bit tricky, but HTMLRewriter allows removal of existing ones)
        // Wait, HTMLRewriter processes in order, we can just remove all existing and let ours be appended.
        // But our CanonicalInjector just appends to head.
        element.remove();
      }
    });

    const response = rewriter.transform(rawResponse);

    // Ensure we keep the correct content-type but don't cache forever if dynamic
    const headers = new Headers(response.headers);
    // Don't modify the cache headers from Pages unless you want to
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: headers
    });
  }
};
