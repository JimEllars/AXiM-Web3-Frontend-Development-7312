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
    if (request.url.includes('/assets/') || request.url.match(/\.(js|css|wasm|png|ico)$/)) {
      return fetch(request);
    }


    // --- NEW: Admin KV Write API ---
    if (request.method === "POST" && url.pathname === "/api/admin/kv-write") {
      try {
        // Note: In strict production, validate a Bearer token or Admin Auth Header here
        const reqData = await request.json();
        const { key, config } = reqData;

        if (env.AXIM_CONFIG && key && config) {
          await env.AXIM_CONFIG.put(key, JSON.stringify(config));
          return new Response(JSON.stringify({ success: true, message: `KV Target [${key}] Updated` }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } else {
          return new Response(JSON.stringify({ error: "Missing KV binding or malformed payload." }), { status: 400 });
        }
      } catch (error) {
        return new Response(JSON.stringify({ error: "KV Write Execution Failed" }), { status: 500 });
      }
    }
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

    // Determine if the request is from a social media crawler
    const isBot = BOT_AGENTS.some(bot => userAgent.includes(bot));

    let dynamicTitle = null;
    let dynamicDesc = null;

    if (env && env.AXIM_CONFIG) {
      try {
        const kvData = await env.AXIM_CONFIG.get(`seo_override_${url.pathname}`, { type: "json" });
        if (kvData) {
          dynamicTitle = kvData.title;
          dynamicDesc = kvData.description;
        }
      } catch (e) {
        console.error("KV Read Error:", e);
      }
    }

    // Only intercept Bot traffic hitting an Article route
    if (isBot && url.pathname.startsWith('/article/')) {
      // SEO CACHE READ
      if (env && env.FRONTEND_SEO_CACHE) {
        try {
          const cachedSEO = await env.FRONTEND_SEO_CACHE.get(request.url);
          if (cachedSEO) {
            return new Response(cachedSEO, {
              status: 200,
              headers: { 'Content-Type': 'text/html' }
            });
          }
        } catch (e) {
          console.error("SEO Cache Read Error:", e);
        }
      }

      const slug = url.pathname.replace('/article/', '').replace('/', '');

      try {
        // Fetch specific article data from the Headless CMS with strict 800ms timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 800);

        let wpRes, wpData;
        try {
          wpRes = await fetch(`https://wp.axim.us.com/wp-json/wp/v2/posts?slug=${slug}&_embed=1`, {
            signal: controller.signal
          });
          clearTimeout(timeoutId);
          wpData = await wpRes.json();
        } catch (fetchErr) {
          clearTimeout(timeoutId);
          // throw fetchErr; // Fail-open safeguard: just log and continue to raw SPA response
          console.error("WP API Fetch Timeout/Error:", fetchErr);
        }

        if (wpData && wpData.length > 0) {
          const article = wpData[0];
          const cleanTitle = dynamicTitle || (article.title.rendered.replace(/<[^>]+>/g, '') + " | AXiM Systems");
          const cleanDesc = dynamicDesc || (article.excerpt.rendered.replace(/<[^>]+>/g, '').substring(0, 160) + "...");
          const imageUrl = article._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://wp.axim.us.com/wp-content/uploads/2026/05/AXiM-Systems-1200x628-layout683-axim-infrastructure-axim-axim-1l1j8ci.webp';

          // Fetch the raw SPA index.html
          const rawResponse = await fetch(request);

          // Use HTMLRewriter to inject the accurate metadata in-flight
          const rewrittenResponse = new HTMLRewriter()
            .on('title', { element(e) { e.setInnerContent(cleanTitle); } })
            .on('meta[name="description"]', { element(e) { e.setAttribute('content', cleanDesc); } })
            .on('meta[property="og:title"]', { element(e) { e.setAttribute('content', cleanTitle); } })
            .on('meta[property="og:description"]', { element(e) { e.setAttribute('content', cleanDesc); } })
            .on('meta[property="og:image"]', { element(e) { e.setAttribute('content', imageUrl); } })
            .on('meta[property="twitter:title"]', { element(e) { e.setAttribute('content', cleanTitle); } })
            .on('meta[property="twitter:image"]', { element(e) { e.setAttribute('content', imageUrl); } })
            .transform(rawResponse);

          // SEO CACHE WRITE
          if (env && env.FRONTEND_SEO_CACHE) {
            try {
              const htmlText = await rewrittenResponse.clone().text();
              await env.FRONTEND_SEO_CACHE.put(request.url, htmlText, { expirationTtl: 86400 });
            } catch (e) {
              console.error("SEO Cache Write Error:", e);
            }
          }

          return rewrittenResponse;
        }
      } catch (err) {
        console.error("Edge Intercept Failed:", err);
      }
    }

    // If human or non-article route, pass through normally but rewrite if KV has data
    const rawResponse = await fetch(request);

    if (dynamicTitle || dynamicDesc) {
        let rewriter = new HTMLRewriter();
        if (dynamicTitle) {
            rewriter = rewriter.on('title', { element(e) { e.setInnerContent(dynamicTitle); } })
                               .on('meta[property="og:title"]', { element(e) { e.setAttribute('content', dynamicTitle); } })
                               .on('meta[property="twitter:title"]', { element(e) { e.setAttribute('content', dynamicTitle); } });
        }
        if (dynamicDesc) {
            rewriter = rewriter.on('meta[name="description"]', { element(e) { e.setAttribute('content', dynamicDesc); } })
                               .on('meta[property="og:description"]', { element(e) { e.setAttribute('content', dynamicDesc); } });
        }
        return rewriter.transform(rawResponse);
    }

    return rawResponse;
  }

};
