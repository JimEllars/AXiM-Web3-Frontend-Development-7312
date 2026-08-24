/**
 * AXiM Local Persistence Engine
 * Mimics a database using localStorage for standalone functionality.
 */

const STORAGE_KEYS = {
  OFFLINE_SESSION: 'axm_offline_session',
  TELEMETRY_CACHE: 'axim_telemetry_cache',
  PROFILES: 'axm_local_profiles',
  LETTERS: 'axm_local_letters',
  SAVED_BRIEFS: 'axm_local_saved_briefs',
  ARTICLE_CACHE: 'axim_article_cache'
};

// Internal memory cache to avoid redundant localStorage I/O and JSON parsing
const _cache = {
  profiles: null,
  letters: null,
  savedBriefs: null
};

/**
 * Internal helper to get data from localStorage or cache.
 */
function _getStoredData(key, defaultValue, cacheKey) {
  if (_cache[cacheKey]) return _cache[cacheKey];

  try {
    const stored = localStorage.getItem(key);
    if (!stored) {
      _cache[cacheKey] = defaultValue;
      return defaultValue;
    }
    const parsed = JSON.parse(stored);

    // Type validation
    const isValid = Array.isArray(defaultValue)
      ? Array.isArray(parsed)
      : (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed));

    _cache[cacheKey] = isValid ? parsed : defaultValue;
    return _cache[cacheKey];
  } catch (e) {
    _cache[cacheKey] = defaultValue;
    return defaultValue;
  }
}

export const localStore = {
  saveArticleCache: (articles) => {
    if (!articles) return;
    try {
      localStorage.setItem(STORAGE_KEYS.ARTICLE_CACHE, JSON.stringify(articles));
    } catch(e) { /* ignore */ }
  },
  getArticleCache: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ARTICLE_CACHE);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      return null;
    } catch(e) {
      return null;
    }
  },
  saveTelemetryCache: (cache) => {
    if (!cache) return;
    try {
      localStorage.setItem(STORAGE_KEYS.TELEMETRY_CACHE, JSON.stringify(cache));
    } catch(e) { /* ignore */ }
  },
  getTelemetryCache: () => {
    return _getStoredData(STORAGE_KEYS.TELEMETRY_CACHE, [], 'telemetryCache');
  },
  saveOfflineSession: (session) => {
    if (!session) return;
    try {
      const stamp = {
        session,
        timestamp: Date.now()
      };
      const encoded = btoa(JSON.stringify(stamp));
      localStorage.setItem(STORAGE_KEYS.OFFLINE_SESSION, encoded);
    } catch(e) { /* ignore */ }
  },

  getOfflineSession: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.OFFLINE_SESSION);
      if (!stored) return null;
      const decoded = JSON.parse(atob(stored));
      if (!decoded || typeof decoded !== 'object' || !decoded.session || !decoded.timestamp) {
        localStorage.removeItem(STORAGE_KEYS.OFFLINE_SESSION);
        return null;
      }
      return decoded;
    } catch(e) {
      localStorage.removeItem(STORAGE_KEYS.OFFLINE_SESSION);
      return null;
    }
  },

  getProfile: (address) => {
    if (!address) return null;
    const profiles = _getStoredData(STORAGE_KEYS.PROFILES, {}, 'profiles');

    if (!profiles[address]) {
      profiles[address] = {
        id: `local-${address.slice(0, 8)}`,
        wallet_address: address,
        clearance_level: 1,
        created_at: new Date().toISOString(),
        is_mock: true
      };
      try {
        localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
      } catch (e) { /* ignore */ }
    }
    return profiles[address];
  },

  saveLetter: (userId, letterData) => {
    const letters = _getStoredData(STORAGE_KEYS.LETTERS, [], 'letters');

    const safeLetterData = letterData || {};
    const newLetter = {
      id: `AXM-${crypto.randomUUID().toUpperCase()}`,
      user_id: userId,
      ...safeLetterData,
      created_at: new Date().toISOString(),
      status: safeLetterData.status || 'draft'
    };
    letters.unshift(newLetter);

    // Keep only last 50
    if (letters.length > 50) {
      letters.splice(50);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(letters));
    } catch (e) { /* ignore */ }

    return newLetter;
  },

  getLetters: (userId) => {
    const letters = _getStoredData(STORAGE_KEYS.LETTERS, [], 'letters');
    return letters.filter(l => l.user_id === userId);
  },


  getSavedBriefs: () => {
    return _getStoredData(STORAGE_KEYS.SAVED_BRIEFS, [], 'savedBriefs');
  },

  toggleSavedBrief: (articleId) => {
    const briefs = _getStoredData(STORAGE_KEYS.SAVED_BRIEFS, [], 'savedBriefs');
    const index = briefs.indexOf(articleId);
    if (index > -1) {
      briefs.splice(index, 1);
    } else {
      briefs.push(articleId);
    }

    // Attempt to save to localStorage
    localStorage.setItem(STORAGE_KEYS.SAVED_BRIEFS, JSON.stringify(briefs));

    return briefs;
  },

  /**
   * Clears the internal cache. Useful for testing or forcing a reload.
   */
  clearCache: () => {
    _cache.profiles = null;
    _cache.letters = null;
    _cache.savedBriefs = null;
  }
};
export function getSavedBriefings() {
  return localStore.getSavedBriefs();
}

export function removeBriefing(id) {
  const briefs = localStore.getSavedBriefs();
  if (briefs.includes(id)) {
    localStore.toggleSavedBrief(id);
  }
}
