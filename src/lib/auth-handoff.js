/**
 * Generates a secure cross-domain URL for handing off an authenticated user
 * to a Cloudflare Worker-backed micro-app.
 *
 * @param {string} workerSubdomain - The target URL (e.g., https://nda.axim.us.com).
 * @param {object} userSession - The Supabase session object.
 * @returns {string} The fully constructed URL with auth query parameters.
 */
export function generateWorkerLaunchUrl(workerSubdomain, userSession) {
  const url = new URL(workerSubdomain);
  url.searchParams.append('source', 'axim_hub');

  if (userSession && userSession.session_token) {
    url.searchParams.append('auth_token', userSession.session_token);
  } else if (userSession && userSession.access_token) {
    url.searchParams.append('auth_token', userSession.access_token);
  }

  return url.toString();
}
