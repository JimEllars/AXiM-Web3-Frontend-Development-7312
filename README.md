# AXiM Web3 Frontend

## Deployment

Cloudflare Pages deploys the production SPA from `dist` using `npm run build`. The build generates
`public/sitemap.xml` from the public WordPress REST API before Vite builds the app.

Set the client-safe Pages environment variables used by the application for production. Values
prefixed with `VITE_` are embedded in the browser bundle, so do not use them for credentials.

```text
VITE_WP_PROXY_URL=https://wp-proxy.axim.us.com
VITE_TELEMETRY_ENDPOINT=https://telemetry.axim.us.com
VITE_THIRDWEB_CLIENT_ID=<public thirdweb client ID>
VITE_TURNSTILE_SITE_KEY=<public Turnstile site key>
VITE_CORE_API_URL=<public AXiM Core API origin>
VITE_AXIM_CORE_URL=<public Supabase-compatible AXiM Core URL>
VITE_AXIM_CORE_API_URL=<public AXiM Core API origin>
VITE_AXIM_CORE_ANON_KEY=<public Core anonymous key, if required>
VITE_SUPABASE_URL=<public Supabase URL, if fallback support ingress is enabled>
VITE_SUPABASE_ANON_KEY=<public Supabase anonymous key, if fallback support ingress is enabled>
VITE_ECHO_WORKER_URL=<public Echo Worker origin, if replay is enabled>
VITE_ONYX_WORKER_URL=<public Onyx Worker origin, if Onyx is enabled>
VITE_ACADEMY_SBT_CONTRACT=<optional contract address>
VITE_USDC_TOKEN_ADDRESS=<optional token address>
VITE_CHATBASE_BOT_ID=<optional public Chatbase bot ID>
VITE_AXIM_ACCESS_TOKEN_ADDRESS=<optional public token address>
VITE_NEWSLETTER_API_URL=<optional public newsletter endpoint>
```

`VITE_AXIM_INTERNAL_KEY` is intentionally unsupported: browser variables are public. Echo and
Onyx endpoints must instead authenticate the user request server-side (for example, with a
session/JWT validated by their Worker or Core). Until those endpoints support that flow, their
authenticated operations remain a backend migration blocker.

## Production activation checklist

1. In Cloudflare **Workers & Pages**, connect the Git repository to the Pages project as the
   primary deployment method. Set production branch `main`, build command `npm run build`, output
   directory `dist`, and the Pages variables above. For an intentional direct upload, run
   `npm run build` followed by `npm run cf:deploy:pages -- --project-name <Pages project name>`.
2. Deploy each Worker with its matching `cf:deploy:*` script. Ensure the Pages custom domain is
   live before routing the SEO Worker at `axim.us.com/*`; its `PAGES_ORIGIN` must remain the
   `pages.dev` origin to avoid recursion.
3. Create/proxy the Worker DNS/custom domains and confirm their routes: `wp-proxy.axim.us.com`,
   `telemetry.axim.us.com`, `rpc.axim.us.com`, and `axim.us.com/*` for SEO. Configure a public
   Onyx/Echo Worker origin when those integrations are enabled.
4. Create and bind the configured KV namespaces: `FRONTEND_SEO_CACHE`, `WEB3_RPC_CACHE`, and
   `TELEMETRY_BUFFER_KV`. Implement an external recovery job to drain telemetry batches from the
   buffer; the Worker preserves them but does not replay them.
5. Set Worker secrets with Wrangler or the dashboard: `ALCHEMY_RPC_URL` on the RPC Worker and
   `AXIM_GATEWAY_TOKEN` on the telemetry Worker. Never place these in Pages variables.
6. Create a Turnstile widget for the production hostnames and set its site key above. The support
   client posts the token as `cf-turnstile-response`; AXiM Core must validate it with Turnstile
   Siteverify using its server-side secret before accepting the support request.
7. The WordPress origin remains an external dependency. It must provide healthy REST responses
   to the deployed proxy and sitemap build; no Pages or Worker setting can repair an unavailable
   upstream origin.

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

`AXIM_GATEWAY_TOKEN` and `ALCHEMY_RPC_URL` are Cloudflare Worker secrets and must never use
a `VITE_` prefix or be added to the Pages environment. The telemetry Worker is configured with
the `AXIM_TELEMETRY_BUFFER` KV namespace to preserve accepted events for 24 hours when AXiM Core
is temporarily unavailable.
