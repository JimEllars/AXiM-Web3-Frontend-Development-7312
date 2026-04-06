/**
 * Sanitizes HTML strings to prevent XSS attacks.
 * Uses a whitelist approach for tags and attributes.
 * Blocks dangerous protocols like 'javascript:' and 'data:' in URI attributes.
 * Optimized for React client-side rendering with fallback for environments without DOMParser.
 */
export function sanitizeHTML(html) {
  if (!html) return '';

  if (typeof window === 'undefined' || !window.DOMParser) {
    // Basic fallback: strip all tags for safety to prevent XSS
    // Note: This may cause hydration mismatches if used in SSR vs Client.
    // However, safety is prioritized over hydration accuracy in this context.
    return html.replace(/<[^>]*>?/gm, '');
  }

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const body = doc.body;

    const ALLOWED_TAGS = new Set([
      'p', 'br', 'strong', 'em', 'b', 'i', 'ul', 'ol', 'li', 'a', 'span', 'div',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'
    ]);

    const ALLOWED_ATTRS = new Set(['href', 'title', 'target', 'rel', 'class', 'id']);
    const DANGEROUS_PROTOCOLS = ['javascript:', 'data:', 'vbscript:'];

    function sanitize(node) {
      // Handle text nodes
      if (node.nodeType === 3) { // Node.TEXT_NODE
        return doc.createTextNode(node.textContent);
      }

      // Handle element nodes
      if (node.nodeType === 1) { // Node.ELEMENT_NODE
        const tagName = node.tagName.toLowerCase();

        if (ALLOWED_TAGS.has(tagName)) {
          const newNode = doc.createElement(tagName);

          // Copy allowed attributes
          for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            const name = attr.name.toLowerCase();
            if (ALLOWED_ATTRS.has(name)) {
              let value = attr.value.toLowerCase().trim();

              // Prevent dangerous protocols in URI-like attributes
              if (name === 'href' || name === 'src' || name === 'action') {
                const isDangerous = DANGEROUS_PROTOCOLS.some(protocol =>
                  value.startsWith(protocol)
                );
                if (isDangerous) continue;
              }

              newNode.setAttribute(attr.name, attr.value);
            }
          }

          // Recursively sanitize children
          for (let i = 0; i < node.childNodes.length; i++) {
            const sanitizedChild = sanitize(node.childNodes[i]);
            if (sanitizedChild) newNode.appendChild(sanitizedChild);
          }
          return newNode;
        } else {
          // Tag not allowed: return a fragment containing sanitized children
          const fragment = doc.createDocumentFragment();
          for (let i = 0; i < node.childNodes.length; i++) {
            const sanitizedChild = sanitize(node.childNodes[i]);
            if (sanitizedChild) fragment.appendChild(sanitizedChild);
          }
          return fragment;
        }
      }

      return null;
    }

    const finalFragment = doc.createDocumentFragment();
    for (let i = 0; i < body.childNodes.length; i++) {
      const sanitized = sanitize(body.childNodes[i]);
      if (sanitized) finalFragment.appendChild(sanitized);
    }

    const container = doc.createElement('div');
    container.appendChild(finalFragment);
    return container.innerHTML;
  } catch (e) {
    console.error('Sanitization failed:', e);
    // Fallback to stripping all tags
    return html.replace(/<[^>]*>?/gm, '');
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
