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
  // Normalize by removing whitespace and control characters to prevent obfuscation like java\nscript
  const normalizedUrl = trimmedUrl.replace(/[\u0000-\u0020\s]/g, '').toLowerCase();

  // Block dangerous protocols early
  if (normalizedUrl.startsWith('javascript:') || normalizedUrl.startsWith('data:') || normalizedUrl.startsWith('vbscript:')) {
    console.warn(`[security] Blocked potentially unsafe protocol: ${url}`);
    return '#';
  }

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  console.warn(`[security] Blocked potentially unsafe URL: ${url}`);
  return '#';
}

/**
 * Internal helper to escape HTML entities in attribute values and text.
 * @param {string} str - The string to escape.
 * @returns {string} - The escaped string.
 */
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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

  // 2. Recursively remove dangerous tags and their contents entirely
  // This prevents bypasses like <scr<script>ipt>
  const dangerousTags = ['script', 'style', 'iframe', 'object', 'embed', 'applet', 'meta', 'link', 'base'];
  let previous;
  do {
    previous = sanitized;
    dangerousTags.forEach(tag => {
      const regex = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi');
      sanitized = sanitized.replace(regex, '');
      const selfClosingRegex = new RegExp(`<${tag}\\b[^>]*\\/?>`, 'gi');
      sanitized = sanitized.replace(selfClosingRegex, '');
    });
  } while (sanitized !== previous && sanitized.length > 0);

  // 3. Define allowlists
  const allowedTags = [
    'p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'a', 'span', 'div',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
  ];

  const allowedAttributes = ['href', 'src', 'alt', 'title', 'class', 'id', 'target', 'rel'];

  // 4. Strict Tag and Attribute Sanitization
  // Matches <tag ...> or </tag>
  // We do this recursively to catch cases where removing a tag creates a new one (e.g. <scr<script>ipt>)
  const processTags = (input) => {
    let current = input;
    let prev;
    do {
      prev = current;
      // Also strip partial tags that might be used to construct dangerous ones
      current = current.replace(/<[a-z1-6]*$/gi, '');
      current = current.replace(/<(\/?)([a-z1-6]+)([^>]*)>/gi, (match, closing, tagName, attrString) => {
        const tag = tagName.toLowerCase();

      if (!allowedTags.includes(tag)) {
        return '';
      }

    if (closing) {
      return `</${tag}>`;
    }

    // Process attributes: strict allowlist
    let sanitizedAttrs = '';

    // Normalize attribute string to handle slash separators like <p/onclick=...>
    const cleanAttrString = attrString.replace(/\//g, ' ');

    // Match attr="val", attr='val', or attr=val
    const attrRegex = /([a-z-]+)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;
    let attrMatch;

    while ((attrMatch = attrRegex.exec(cleanAttrString)) !== null) {
      const attrName = attrMatch[1].toLowerCase();
      let attrValue = attrMatch[2];

      if (allowedAttributes.includes(attrName)) {
        // Strip surrounding quotes
        let rawValue = attrValue.replace(/^["']|["']$/g, '');

        // Protocol check for sensitive attributes
        if (['href', 'src'].includes(attrName)) {
           rawValue = ensureSafeProtocol(rawValue);
        }

        sanitizedAttrs += ` ${attrName}="${escapeHTML(rawValue)}"`;
      }
    }

        return `<${tag}${sanitizedAttrs}>`;
      });
    } while (current !== prev && current.length > 0);
    return current;
  };

  sanitized = processTags(sanitized);

  return sanitized;
}
