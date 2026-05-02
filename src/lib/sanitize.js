/**
 * AXiM Security - Sanitization Utility
 *
 * Provides lightweight, dependency-free sanitization for URLs.
 * Designed to mitigate XSS risks by enforcing safe protocols.
 *
 * Note: For complex HTML sanitization, use isomorphic-dompurify as seen in the components.
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

    return '#';
  }

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }


  return '#';
}
