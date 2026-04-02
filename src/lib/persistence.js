/**
 * AXiM Local Persistence Engine
 * Mimics a database using localStorage for standalone functionality.
 */

const STORAGE_KEYS = {
  PROFILES: 'axm_local_profiles',
  LETTERS: 'axm_local_letters'
};

const _getStoredData = (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    const parsed = JSON.parse(item);

    if (Array.isArray(defaultValue)) {
      return Array.isArray(parsed) ? parsed : defaultValue;
    }

    if (typeof defaultValue === 'object' && defaultValue !== null) {
      return (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed))
        ? parsed
        : defaultValue;
    }

    return parsed;
  } catch (e) {
    return defaultValue;
  }
};

export const localStore = {
  getProfile: (address) => {
    if (!address) return null;
    const profiles = _getStoredData(STORAGE_KEYS.PROFILES, {});

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
        console.error('Failed to save profile to localStorage', e);
      }
    }
    return profiles[address];
  },

  saveLetter: (userId, letterData) => {
    const letters = _getStoredData(STORAGE_KEYS.LETTERS, []);

    const safeLetterData = letterData || {};
    const newLetter = {
      id: `AXM-${crypto.randomUUID().toUpperCase()}`,
      user_id: userId,
      ...safeLetterData,
      created_at: new Date().toISOString(),
      status: safeLetterData.status || 'draft'
    };
    letters.unshift(newLetter);

    try {
      localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(letters.slice(0, 50)));
    } catch (e) {
      console.error('Failed to save letter to localStorage', e);
    }

    return newLetter;
  },

  getLetters: (userId) => {
    const letters = _getStoredData(STORAGE_KEYS.LETTERS, []);
    return letters.filter(l => l.user_id === userId);
  }
};