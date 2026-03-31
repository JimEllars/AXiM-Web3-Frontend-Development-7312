/**
 * AXiM Local Persistence Engine
 * Mimics a database using localStorage for standalone functionality.
 */

const STORAGE_KEYS = {
  PROFILES: 'axm_local_profiles',
  LETTERS: 'axm_local_letters'
};

export const localStore = {
  getProfile: (address) => {
    if (!address) return null;
    let profiles = {};
    try {
      profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '{}');
      if (typeof profiles !== 'object' || profiles === null || Array.isArray(profiles)) {
        profiles = {};
      }
    } catch (e) {
      profiles = {};
    }

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
    let letters = [];
    try {
      letters = JSON.parse(localStorage.getItem(STORAGE_KEYS.LETTERS) || '[]');
      if (!Array.isArray(letters)) {
        letters = [];
      }
    } catch (e) {
      letters = [];
    }

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
    let letters = [];
    try {
      letters = JSON.parse(localStorage.getItem(STORAGE_KEYS.LETTERS) || '[]');
      if (!Array.isArray(letters)) {
        letters = [];
      }
    } catch (e) {
      letters = [];
    }
    return letters.filter(l => l.user_id === userId);
  }
};