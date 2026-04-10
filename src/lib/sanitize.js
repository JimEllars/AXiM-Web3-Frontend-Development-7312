/**
 * AXiM Security - Sanitization Utility
 *
 * Provides lightweight, dependency-free sanitization for HTML and URLs.
 * Designed to mitigate XSS risks while maintaining essential formatting for WordPress content.
 *
 * NOTE: This is a robust fallback implementation. Once sandbox connectivity
 * stabilizes, it is recommended to fully transition to isomorphic-dompurify.
 */

/**
 * Sanitizes a URL to prevent XSS via dangerous protocols like 'javascript:'.
 * Permits only http:, https:, and relative paths.
 *
 * @param {string} url - The URL to sanitize.
 * @returns {string} - The sanitized URL or '#' if dangerous/invalid.
 */
export function ensureSafeProtocol(url) {
  if (!url) return '#';

  const trimmedUrl = url.trim();

  // Allow relative paths (starting with /, #, or ?)
  if (trimmedUrl.startsWith('/') || trimmedUrl.startsWith('#') || trimmedUrl.startsWith('?')) {
    return trimmedUrl;
  }

  // Allow explicitly safe protocols
  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  console.warn(`[security] Blocked potentially unsafe URL: ${url}`);
  return '#';
}

/**
 * Sanitizes HTML strings using a strict allowlist of tags and attributes.
 * Removes scripts, event handlers, and dangerous protocols.
 *
 * @param {string} html - The raw HTML string to sanitize.
 * @returns {string} - The sanitized HTML string.
 */
export function sanitizeHTML(html) {
  if (!html) return '';

  // 1. Remove comments
  let sanitized = html.replace(/<!--[\s\S]*?-->/g, '');

  // 2. Remove dangerous tags and their contents entirely
  const dangerousTags = ['script', 'style', 'iframe', 'object', 'embed', 'applet', 'meta', 'link', 'base'];
  dangerousTags.forEach(tag => {
    const regex = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
    sanitized = sanitized.replace(regex, '');
    // Also catch self-closing versions or cases with no closing tag
    const selfClosingRegex = new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi');
    sanitized = sanitized.replace(selfClosingRegex, '');
  });

  // 3. Remove all event handlers (onclick, onerror, etc.)
  // Matches any attribute starting with 'on' followed by word characters
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');

  // 4. Sanitize potentially dangerous attributes (href, src, etc.)
  sanitized = sanitized.replace(/\s+(href|src|action|data|formaction)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, (match, attr, val) => {
    const rawVal = val.replace(/["']/g, '').trim().toLowerCase();
    if (rawVal.startsWith('javascript:') || rawVal.startsWith('data:') || rawVal.startsWith('vbscript:')) {
      return ` ${attr}="#"`;
    }
    return match;
  });

  // 5. Strict Tag Allowlist
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'a', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
  ];

  // Strip any tag not in the allowlist
  sanitized = sanitized.replace(/<(\/?)([a-z1-6]+)([^>]*)>/gi, (match, closing, tag, attrs) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      return match;
    }
    return '';
  });

  return sanitized;
}
