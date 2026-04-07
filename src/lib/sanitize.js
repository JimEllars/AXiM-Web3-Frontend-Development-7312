import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML strings to prevent XSS attacks.
 * Uses a whitelist approach for tags and attributes.
 * Blocks dangerous protocols like 'javascript:' and 'data:' in URI attributes.
 * Uses isomorphic-dompurify for robust, cross-environment sanitization.
 */
export function sanitizeHTML(html) {
  if (!html) return '';

  try {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'a', 'span', 'div',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
      ],
      ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class', 'id'],
      RETURN_DOM: false,
      RETURN_DOM_FRAGMENT: false,
      RETURN_DOM_IMPORT: false
    });
  } catch (e) {
    console.error('Sanitization failed:', e);
    return '';
  }
}

/**
 * Sanitizes a URL to prevent XSS via dangerous protocols like 'javascript:'.
 * @param {string} url - The URL to sanitize.
 * @returns {string} - The sanitized URL or '#' if dangerous.
 */
export function sanitizeURL(url) {
  if (!url) return '#';

  const trimmedUrl = url.trim().toLowerCase();
  const DANGEROUS_PROTOCOLS = ['javascript:', 'data:', 'vbscript:'];

  const isDangerous = DANGEROUS_PROTOCOLS.some(protocol =>
    trimmedUrl.startsWith(protocol)
  );

  if (isDangerous) {
    console.warn(`[security] Blocked dangerous protocol in URL: ${url}`);
    return '#';
  }

  return url;
}

/**
 * Ensures a URL uses a safe protocol (http/https) or is a relative path.
 * Uses the native URL constructor for robust validation.
 * @param {string} url - The URL to validate.
 * @returns {string} - The safe URL or '#' if dangerous.
 */
export function ensureSafeProtocol(url) {
  if (!url) return '#';
  if (typeof url !== 'string') return '#';

  const trimmed = url.trim();

  try {
    let absoluteParsed;
    try {
      absoluteParsed = new URL(trimmed);
    } catch (e) {
      // URL is not absolute. Parse it against a dummy HTTP base to ensure
      // it doesn't contain hidden malicious protocols.
      const parsedWithBase = new URL(trimmed, 'http://dummy.local');
      if (parsedWithBase.protocol === 'http:' || parsedWithBase.protocol === 'https:') {
        return trimmed;
      }
      return '#';
    }

    // It is an absolute URL
    if (absoluteParsed.protocol === 'http:' || absoluteParsed.protocol === 'https:') {
      return trimmed;
    }

    console.warn(`[security] Blocked dangerous protocol in URL: ${trimmed}`);
    return '#';
  } catch (e) {
    console.warn(`[security] Failed to parse URL: ${trimmed}`, e);
    return '#';
  }
}
