# AXiM Web3 Frontend

## Deployment

Cloudflare Pages deploys the production SPA from `dist` using `npm run build`. The build generates
`public/sitemap.xml` from the public WordPress REST API before Vite builds the app.

Set these Pages environment variables for production:

```text
VITE_WP_PROXY_URL=https://wp-proxy.axim.us.com
VITE_TELEMETRY_ENDPOINT=https://telemetry.axim.us.com
VITE_THIRDWEB_CLIENT_ID=<public thirdweb client ID>
VITE_TURNSTILE_SITE_KEY=<public Turnstile site key>
```

Deploy the Workers after setting their secrets:

```text
axim-wp-proxy-worker: no secrets required
axim-seo-worker: no secrets required
axim-rpc-worker: ALCHEMY_RPC_URL
axim-telemetry-worker: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
```

Use the matching `npm run cf:deploy:*` script for each Worker. The WordPress origin at
`https://wp.axim.us.com` must return healthy WordPress REST responses; the proxy cannot recover
content when that upstream service returns an error.
