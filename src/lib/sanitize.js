import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes HTML strings to prevent XSS attacks.
 * Uses isomorphic-dompurify for robust, isomorphic sanitization.
 * Blocks dangerous protocols like 'javascript:' and 'data:' in URI attributes.
 */
export function sanitizeHTML(html) {
  if (!html) return '';

  const ALLOWED_TAGS = [
    'p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'a', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
  ];

  const ALLOWED_ATTR = ['href', 'title', 'target', 'rel', 'class', 'id'];

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    KEEP_CONTENT: true, // Equivalent to preserving safe children of stripped unsafe tags
  });
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
