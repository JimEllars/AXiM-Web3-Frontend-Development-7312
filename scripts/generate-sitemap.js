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
    '/',
    '/tools',
    '/articles',
    '/documentation',
    '/tool-guides',
    '/partners',
    '/status',
    '/early-access'
  ];

  const posts = await fetchAllPosts();

  const dynamicRoutes = posts.map(post => `/article/${post.slug}`);
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(route => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <changefreq>daily</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
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
