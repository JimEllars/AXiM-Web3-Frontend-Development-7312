export function ensureSafeProtocol(url) {
  if (!url) return '#';
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return url;
    }
    return '#';
  } catch (e) {
    if (url.startsWith('/') || url.startsWith('#') || url.startsWith('?')) {
      return url;
    }
    return '#';
  }
}
