import { logTelemetry } from './telemetry';

/**
 * Generates a secure cross-domain URL for handing off an authenticated user
 * to a Cloudflare Worker-backed micro-app.
 *
 * @param {string} workerSubdomain - The target URL (e.g., https://nda.axim.us.com).
 * @param {object} userSession - The Supabase session object.
 * @returns {string} The fully constructed URL with auth query parameters.
 */
export function generateWorkerLaunchUrl(workerSubdomain, userSession) {
  try {
    const url = new URL(workerSubdomain);
    url.searchParams.append('source', 'axim_hub');

    if (userSession && userSession.session_token) {
      url.searchParams.append('auth_token', userSession.session_token);
    } else if (userSession && userSession.access_token) {
      url.searchParams.append('auth_token', userSession.access_token);
    }

    // Try to extract an address from the userSession or fallback
    const walletAddress = userSession?.user?.id || userSession?.user?.user_metadata?.wallet_address || 'unknown';

    logTelemetry('AUTH_HANDOFF_SUCCESS', { wallet: walletAddress });

    return url.toString();
  } catch (err) {
    logTelemetry('AUTH_HANDOFF_FAILED', { error: err.message });
    throw err;
  }
}

// Added to support generateHandoffLink as requested
export function generateHandoffLink(subdomain, token) {
  return `https://${subdomain}.axim.us.com/?auth_token=${token || ''}`;
}

export function generateCrossAppHandoffUrl(targetAppUrl, sessionData) {
  logTelemetry('cross_app_sso_handoff_initiated', {
    targetApp: targetAppUrl,
    authMethod: sessionData?.walletAddress ? 'web3_wallet' : 'email_key'
  });
  const url = new URL(targetAppUrl);
  url.searchParams.set('sso_token', sessionData?.token || 'guest');
  return url.toString();
}

/**
 * Exchanges a Passport SSO token with AXiM Core API, handling exponential backoff.
 * @param {string} token - The SSO token from URL
 * @returns {Promise<any>}
 */
export async function exchangePassportToken(token) {
  const url = `${import.meta.env.VITE_CORE_API_URL || ''}/api/v1/auth/exchange`;
  let retries = 2;
  let delay = 400;

  while (retries >= 0) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sso_token: token })
      });
      if (!response.ok) {
        throw new Error(`Token exchange returned ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      if (retries === 0) {
        throw err;
      }
      retries--;
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}
