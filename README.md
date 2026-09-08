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

Deploy the Workers after setting their required configuration:

```text
axim-wp-proxy-worker: no secrets required
axim-seo-worker: PAGES_ORIGIN=https://axim-web3-frontend-development-7312.pages.dev
axim-rpc-worker: ALCHEMY_RPC_URL
axim-telemetry-worker: AXIM_GATEWAY_TOKEN
```

Use the matching `npm run cf:deploy:*` script for each Worker. The WordPress origin at
`https://wp.axim.us.com` must return healthy WordPress REST responses; the proxy cannot recover
content when that upstream service returns an error.

The SEO Worker must proxy to the Pages project's `pages.dev` origin, not `axim.us.com`; using the
public custom domain causes the Worker to invoke itself recursively. Set its non-secret origin
when deploying:

`PAGES_ORIGIN` is committed in `workers/wrangler.seo.toml` and points to the current production Pages project.
