# Cloudflare Workers Setup for AXiM Micro-Apps

This document outlines the required configuration for the backend engineering team to securely map the Cloudflare Worker micro-apps to their respective subdomains, and how to verify the secure handoff token from the AXiM Hub.

## 1. Subdomain Mapping (`wrangler.toml`)

To attach the Worker to a custom subdomain (e.g., `nda.axim.us.com`), you must update the `wrangler.toml` file in the Worker's repository.

```toml
# wrangler.toml
name = "axim-nda-worker"
main = "src/index.js"
compatibility_date = "2024-03-20"

# Map to the specific micro-app subdomain
routes = [
  { pattern = "nda.axim.us.com", custom_domain = true }
]

[vars]
# Ensure your environment variables are configured
SUPABASE_URL = "https://your-project-ref.supabase.co"
```

*Note: Ensure the DNS records for the subdomain are proxied through Cloudflare (Orange Cloud).*

## 2. Secure Auth Handoff Verification

When a user clicks "Launch Application" from the AXiM Hub, they are redirected to the worker domain with two query parameters:
- `source=axim_hub`
- `auth_token=<SUPABASE_JWT>`

The Worker needs to intercept this request, extract the token, and optionally verify it against Supabase before allowing the user to access protected resources.

Here is a boilerplate snippet showing how to implement this in the Worker's `fetch` event:

```javascript
// src/index.js

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Extract the handoff parameters
    const source = url.searchParams.get('source');
    const authToken = url.searchParams.get('auth_token');

    // 2. Validate the handoff request
    if (source === 'axim_hub' && authToken) {
      try {
        // Option A: Validate locally if using a known JWT secret
        // Option B: Call Supabase REST API to verify the user
        const supabaseUrl = env.SUPABASE_URL;
        const supabaseAnonKey = env.SUPABASE_ANON_KEY;

        const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'apikey': supabaseAnonKey
          }
        });

        if (!response.ok) {
          throw new Error('Invalid or expired authentication token');
        }

        const user = await response.json();

        // 3. User is verified!
        // Proceed with creating the secure session or rendering the application
        // e.g., set an HTTP-only secure cookie for subsequent requests

        console.log(`Successfully handed off user: ${user.id}`);

        // Return your application payload...
        return new Response(`Welcome, authenticated user ${user.id}!`, {
            status: 200,
            headers: { 'Content-Type': 'text/plain' }
        });

      } catch (error) {
        return new Response('Unauthorized - Invalid Handoff Token', { status: 401 });
      }
    }

    // 4. Handle standard unauthenticated requests (if applicable)
    // For example, redirecting back to the Hub if auth is required
    if (!authToken) {
      return Response.redirect('https://axim.us.com/tools/nda', 302);
    }

    return new Response('Not Found', { status: 404 });
  }
};
```
