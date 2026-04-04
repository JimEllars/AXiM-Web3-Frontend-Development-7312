/**
 * AXiM Local Persistence Engine
 * Mimics a database using localStorage for standalone functionality,
 * now using Web Crypto API to secure stored data.
 */

const STORAGE_KEYS = {
  PROFILES: 'axm_local_profiles',
  LETTERS: 'axm_local_letters'
};

// Cryptography settings
const ENCRYPTION_ALGORITHM = 'AES-GCM';
const IDB_STORE_NAME = 'axim_key_store';
const IDB_KEY_NAME = 'axim_encryption_key';

let cachedKey = null;

// Helper to open IndexedDB
const openKeyDB = () => {
  return new Promise((resolve, reject) => {
    // In test environments without indexedDB, we fail gracefully
    if (typeof indexedDB === 'undefined') {
      return reject(new Error('IndexedDB not available'));
    }
    const request = indexedDB.open('AXiM_Secure_Storage', 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(IDB_STORE_NAME)) {
        db.createObjectStore(IDB_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const getCryptoKey = async () => {
  if (cachedKey) return cachedKey;

  try {
    const db = await openKeyDB();

    // Check if we already have a key stored
    const key = await new Promise((resolve, reject) => {
      const transaction = db.transaction(IDB_STORE_NAME, 'readonly');
      const store = transaction.objectStore(IDB_STORE_NAME);
      const request = store.get(IDB_KEY_NAME);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (key) {
      cachedKey = key;
      return key;
    }

    // Generate a new, non-extractable key
    const newKey = await crypto.subtle.generateKey(
      { name: ENCRYPTION_ALGORITHM, length: 256 },
      false, // non-extractable!
      ['encrypt', 'decrypt']
    );

    // Store it in IndexedDB
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(IDB_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(IDB_STORE_NAME);
      const request = store.put(newKey, IDB_KEY_NAME);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    cachedKey = newKey;
    return newKey;
  } catch (err) {
    console.error('Failed to access secure key from IndexedDB:', err);
    // Fallback for tests or unsupported browsers: generate ephemeral key in memory
    // Data won't persist across reloads in this fallback, but protects against snooping.
    const fallbackKey = await crypto.subtle.generateKey(
      { name: ENCRYPTION_ALGORITHM, length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
    cachedKey = fallbackKey;
    return fallbackKey;
  }
};

const encryptData = async (data) => {
  try {
    const key = await getCryptoKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(JSON.stringify(data));

    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: iv
      },
      key,
      encodedData
    );

    // Combine IV and encrypted data for storage
    const encryptedArray = new Uint8Array(encryptedContent);
    const combined = new Uint8Array(iv.length + encryptedArray.length);
    combined.set(iv, 0);
    combined.set(encryptedArray, iv.length);

    // Convert to Base64 to store in localStorage
    return btoa(String.fromCharCode.apply(null, combined));
  } catch (err) {
    console.error('Encryption failed', err);
    throw err;
  }
};

const decryptData = async (encryptedBase64) => {
  try {
    const key = await getCryptoKey();
    // Decode Base64 to Uint8Array
    const binaryString = atob(encryptedBase64);
    const combined = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      combined[i] = binaryString.charCodeAt(i);
    }

    // Extract IV (first 12 bytes) and ciphertext
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: ENCRYPTION_ALGORITHM,
        iv: iv
      },
      key,
      ciphertext
    );

    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedContent));
  } catch (err) {
    // If decryption fails, it might be plaintext old data, try parsing directly
    try {
      return JSON.parse(encryptedBase64);
    } catch {
      throw new Error('Data could not be decrypted or parsed');
    }
  }
};

const _getStoredData = async (key, defaultValue) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    const parsed = await decryptData(item);

    if (Array.isArray(defaultValue)) {
      return Array.isArray(parsed) ? parsed : defaultValue;
    }

    if (typeof defaultValue === 'object' && defaultValue !== null) {
      return (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed))
        ? parsed
        : defaultValue;
    }

    return parsed;
  } catch {
    return defaultValue;
  }
};

const _saveData = async (key, data) => {
  try {
    const encrypted = await encryptData(data);
    localStorage.setItem(key, encrypted);
  } catch {
    console.error(`Failed to save ${key} to localStorage`);
  }
};

export const localStore = {
  getProfile: async (address) => {
    if (!address) return null;
    const profiles = await _getStoredData(STORAGE_KEYS.PROFILES, {});

    if (!profiles[address]) {
      profiles[address] = {
        id: `local-${address.slice(0, 8)}`,
        wallet_address: address,
        clearance_level: 1,
        created_at: new Date().toISOString(),
        is_mock: true
      };
      await _saveData(STORAGE_KEYS.PROFILES, profiles);
    }
    return profiles[address];
  },

  saveLetter: async (userId, letterData) => {
    const letters = await _getStoredData(STORAGE_KEYS.LETTERS, []);

    const safeLetterData = letterData || {};
    const newLetter = {
      id: `AXM-${crypto.randomUUID().toUpperCase()}`,
      user_id: userId,
      ...safeLetterData,
      created_at: new Date().toISOString(),
      status: safeLetterData.status || 'draft'
    };
    letters.unshift(newLetter);

    await _saveData(STORAGE_KEYS.LETTERS, letters.slice(0, 50));

    return newLetter;
  },

  getLetters: async (userId) => {
    const letters = await _getStoredData(STORAGE_KEYS.LETTERS, []);
    return letters.filter(l => l.user_id === userId);
  }
};