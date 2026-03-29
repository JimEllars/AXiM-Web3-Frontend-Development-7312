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
    const profiles = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILES) || '{}');
    if (!profiles[address]) {
      profiles[address] = {
        id: `local-${address.slice(0, 8)}`,
        wallet_address: address,
        clearance_level: 1,
        created_at: new Date().toISOString(),
        is_mock: true
      };
      localStorage.setItem(STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    }
    return profiles[address];
  },

  saveLetter: (userId, letterData) => {
    const letters = JSON.parse(localStorage.getItem(STORAGE_KEYS.LETTERS) || '[]');
    const newLetter = {
      id: `AXM-${crypto.randomUUID().toUpperCase()}`,
      user_id: userId,
      ...letterData,
      created_at: new Date().toISOString(),
      status: letterData.status || 'draft'
    };
    letters.unshift(newLetter);
    localStorage.setItem(STORAGE_KEYS.LETTERS, JSON.stringify(letters.slice(0, 50)));
    return newLetter;
  },

  getLetters: (userId) => {
    const letters = JSON.parse(localStorage.getItem(STORAGE_KEYS.LETTERS) || '[]');
    return letters.filter(l => l.user_id === userId);
  }
};