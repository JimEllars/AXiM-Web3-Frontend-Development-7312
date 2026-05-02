/**
 * AXiM Local Persistence Engine
 * Mimics a database using localStorage for standalone functionality.
 */

const STORAGE_KEYS = {
  PROFILES: 'axm_local_profiles',
  LETTERS: 'axm_local_letters'
};

// Internal memory cache to avoid redundant localStorage I/O and JSON parsing
const _cache = {
  profiles: null,
  letters: null
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
      } catch (e) {

      }
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
    } catch (e) {

    }

    return newLetter;
  },

  getLetters: (userId) => {
    const letters = _getStoredData(STORAGE_KEYS.LETTERS, [], 'letters');
    return letters.filter(l => l.user_id === userId);
  },

  /**
   * Clears the internal cache. Useful for testing or forcing a reload.
   */
  clearCache: () => {
    _cache.profiles = null;
    _cache.letters = null;
  }
};