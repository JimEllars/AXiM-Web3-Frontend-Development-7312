import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { theme } from '../src/config/theme.js';
const WP_REST_ENDPOINT = theme.wpRestEndpoint.replace("axim.us.com", "wp.axim.us.com");
const BASE_URL = "https://axim.us.com"; // Adjust as needed based on the deployed url

async function fetchAllPosts() {
  let allPosts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const res = await fetch(`${WP_REST_ENDPOINT}/posts?per_page=100&page=${page}`);
      if (!res.ok) {
        hasMore = false;
        break;
      }

      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Expected JSON, got', contentType);
        hasMore = false;
        break;
      }
      const posts = await res.json();
      if (posts.length === 0) {
        hasMore = false;
      } else {
        allPosts = allPosts.concat(posts);
        page++;
      }
    } catch (err) {
      console.error("Error fetching posts for sitemap:", err);
      hasMore = false;
    }
  }

  return allPosts;
}

async function generateSitemap() {
  console.log("Generating sitemap...");
  const staticRoutes = [
    { route: '/', priority: '1.0', changefreq: 'daily' },
    { route: '/articles', priority: '0.8', changefreq: 'daily' },
    { route: '/business', priority: '0.8', changefreq: 'daily' },
    { route: '/products/nexus-crm-course', priority: '0.8', changefreq: 'daily' },
    { route: '/products/nexus-crm', priority: '0.8', changefreq: 'daily' },
    { route: '/personal', priority: '0.8', changefreq: 'daily' },
    { route: '/store', priority: '0.8', changefreq: 'daily' },
    { route: '/games', priority: '0.6', changefreq: 'weekly' },
    { route: '/ai', priority: '0.8', changefreq: 'daily' },
    { route: '/tech', priority: '0.9', changefreq: 'weekly' },
    { route: '/consultation', priority: '0.8', changefreq: 'daily' },
    { route: '/support', priority: '0.8', changefreq: 'daily' },
    { route: '/terms', priority: '0.8', changefreq: 'daily' },
    { route: '/partners', priority: '0.8', changefreq: 'daily' },
    { route: '/partners/make', priority: '0.8', changefreq: 'daily' },
    { route: '/partners/powur-solar', priority: '0.8', changefreq: 'daily' },
    { route: '/partners/powur-join', priority: '0.8', changefreq: 'daily' },
    { route: '/partners/chatbase', priority: '0.8', changefreq: 'daily' },
    { route: '/early-access', priority: '0.8', changefreq: 'daily' },
    { route: '/services', priority: '0.9', changefreq: 'weekly' },
    { route: '/services/window-cleaning', priority: '0.9', changefreq: 'weekly' },
    { route: '/services/pressure-washing', priority: '0.9', changefreq: 'weekly' },
    { route: '/services/commercial-exterior', priority: '0.9', changefreq: 'weekly' }
  ];

  const posts = await fetchAllPosts();

  const dynamicRoutes = posts
    .filter(post => post?.slug)
    .map(post => ({
      route: `/article/${post.slug}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: post.modified || post.date
    }));
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(item => `  <url>
    <loc>${BASE_URL}${item.route}</loc>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>${item.lastmod ? `
    <lastmod>${new Date(item.lastmod).toISOString().slice(0, 10)}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml);
  console.log("Sitemap generated successfully at public/sitemap.xml");
}

generateSitemap();
