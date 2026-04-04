import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { localStore } from './persistence.js';

// Web Crypto API polyfill for Node.js test runner
import crypto from 'node:crypto';
if (typeof global.crypto === 'undefined' || typeof global.crypto.subtle === 'undefined') {
  global.crypto = crypto.webcrypto;
}

// Ensure tests and persistence.js share the exact same fallback key
let _testKey = null;
const originalGenerateKey = global.crypto.subtle.generateKey.bind(global.crypto.subtle);
global.crypto.subtle.generateKey = async (...args) => {
  if (!_testKey) {
    _testKey = await originalGenerateKey(...args);
  }
  return _testKey;
};

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
    removeItem: (key) => {
      delete store[key];
    }
  };
})();

describe('localStorageMock.removeItem', () => {
  test('should successfully remove an item', () => {
    localStorageMock.setItem('test_key', 'test_value');
    localStorageMock.removeItem('test_key');
    assert.strictEqual(localStorageMock.getItem('test_key'), null);
  });
});

global.localStorage = localStorageMock;

// Expose the decrypt logic to tests so they can verify contents correctly
// The test uses a globally cached key that matches the fallback ephemeral key mechanism
const ENCRYPTION_ALGORITHM = 'AES-GCM';

const getCryptoKey = async () => {
  if (!_testKey) {
    _testKey = await crypto.subtle.generateKey(
      { name: ENCRYPTION_ALGORITHM, length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
  return _testKey;
};

const decryptDataForTest = async (encryptedBase64) => {
  try {
    const key = await getCryptoKey();
    const binaryString = atob(encryptedBase64);
    const combined = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      combined[i] = binaryString.charCodeAt(i);
    }
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const decryptedContent = await crypto.subtle.decrypt(
      { name: ENCRYPTION_ALGORITHM, iv: iv },
      key,
      ciphertext
    );
    const decoder = new TextDecoder();
    return JSON.parse(decoder.decode(decryptedContent));
  } catch (err) {
    try {
      return JSON.parse(encryptedBase64);
    } catch {
      return null;
    }
  }
};

describe('localStore.getProfile', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should return null when address is null', async () => {
    const result = await localStore.getProfile(null);
    assert.strictEqual(result, null);
  });

  test('should return null when address is undefined', async () => {
    let getItemCalled = false;
    const originalGetItem = localStorage.getItem;
    try {
      localStorage.getItem = (...args) => {
        getItemCalled = true;
        return originalGetItem(...args);
      };
      const result = await localStore.getProfile(undefined);
      assert.strictEqual(result, null);
      assert.strictEqual(getItemCalled, false, 'localStorage.getItem should not be called when address is undefined');
    } finally {
      localStorage.getItem = originalGetItem;
    }
  });

  test('should return null when getProfile is called without arguments', async () => {
    let getItemCalled = false;
    const originalGetItem = localStorage.getItem;
    try {
      localStorage.getItem = (...args) => {
        getItemCalled = true;
        return originalGetItem(...args);
      };
      const result = await localStore.getProfile();
      assert.strictEqual(result, null);
      assert.strictEqual(getItemCalled, false, 'localStorage.getItem should not be called when address is missing');
    } finally {
      localStorage.getItem = originalGetItem;
    }
  });

  test('should return null when address is empty string', async () => {
    let getItemCalled = false;
    const originalGetItem = localStorage.getItem;
    try {
      localStorage.getItem = (...args) => {
        getItemCalled = true;
        return originalGetItem(...args);
      };
      const result = await localStore.getProfile('');
      assert.strictEqual(result, null);
      assert.strictEqual(getItemCalled, false, 'localStorage.getItem should not be called when address is empty string');
    } finally {
      localStorage.getItem = originalGetItem;
    }
  });

  test('should create and return a new profile for a valid address', async () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    const result = await localStore.getProfile(address);

    assert.ok(result);
    assert.strictEqual(result.wallet_address, address);
    assert.strictEqual(result.id, `local-${address.slice(0, 8)}`);
    assert.strictEqual(result.clearance_level, 1);
    assert.strictEqual(result.is_mock, true);
    assert.ok(result.created_at);

    // Verify it was saved securely to localStorage
    const storedProfilesEncrypted = localStorage.getItem('axm_local_profiles');
    assert.ok(storedProfilesEncrypted);
    assert.ok(storedProfilesEncrypted !== JSON.stringify({ [address]: result }), 'Data should be encrypted');

    const storedProfiles = await decryptDataForTest(storedProfilesEncrypted);
    assert.ok(storedProfiles[address]);
    assert.deepStrictEqual(storedProfiles[address], result);
  });


  test('should fallback and parse plaintext JSON if data is not encrypted (backward compatibility)', async () => {
    const address = '0xexisting';
    const existingProfile = {
      id: 'local-0xexistin',
      wallet_address: address,
      clearance_level: 2,
      created_at: '2023-01-01T00:00:00.000Z',
      is_mock: true
    };

    localStorage.setItem('axm_local_profiles', JSON.stringify({ [address]: existingProfile }));

    const result = await localStore.getProfile(address);
    assert.deepStrictEqual(result, existingProfile);
  });

  test('should handle invalid JSON in localStorage gracefully by returning a new profile', async () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    localStorage.setItem('axm_local_profiles', 'invalid json data');

    const result = await localStore.getProfile(address);
    assert.ok(result);
    assert.strictEqual(result.wallet_address, address);
    assert.strictEqual(result.id, `local-${address.slice(0, 8)}`);
    assert.strictEqual(result.clearance_level, 1);
  });

  test('should handle non-object JSON in localStorage gracefully by returning a new profile', async () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    localStorage.setItem('axm_local_profiles', '"string instead of object"');

    const result = await localStore.getProfile(address);
    assert.ok(result);
    assert.strictEqual(result.wallet_address, address);
  });

  test('should gracefully handle localStorage.setItem failure in getProfile', async () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => { throw new Error('QuotaExceededError'); };

    try {
      const result = await localStore.getProfile(address);
      assert.ok(result);
      assert.strictEqual(result.wallet_address, address);
    } finally {
      localStorage.setItem = originalSetItem;
    }
  });
});

describe('localStore.saveLetter', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should save a new letter with generated id, date and draft status', async () => {
    const userId = 'user123';
    const letterData = { title: 'Test Letter', content: 'Hello World' };

    const result = await localStore.saveLetter(userId, letterData);

    assert.ok(result);
    assert.strictEqual(result.user_id, userId);
    assert.strictEqual(result.title, 'Test Letter');
    assert.strictEqual(result.content, 'Hello World');
    assert.ok(result.id.startsWith('AXM-'));
    assert.strictEqual(result.id, result.id.toUpperCase());
    assert.strictEqual(result.status, 'draft');
    assert.ok(result.created_at);

    // Verify it was securely saved to localStorage
    const storedLettersEncrypted = localStorage.getItem('axm_local_letters');
    assert.ok(storedLettersEncrypted);

    const storedLetters = await decryptDataForTest(storedLettersEncrypted);
    assert.strictEqual(storedLetters.length, 1);
    assert.deepStrictEqual(storedLetters[0], result);
  });

  test('should save a new letter with provided status', async () => {
    const userId = 'user123';
    const letterData = { title: 'Test Letter', status: 'published' };

    const result = await localStore.saveLetter(userId, letterData);

    assert.strictEqual(result.status, 'published');
  });

  test('should keep only the last 50 letters in localStorage', async () => {
    const userId = 'user123';
    for (let i = 0; i < 55; i++) {
      await localStore.saveLetter(userId, { title: `Letter ${i}` });
    }

    const storedLettersEncrypted = localStorage.getItem('axm_local_letters');
    const storedLetters = await decryptDataForTest(storedLettersEncrypted);

    assert.strictEqual(storedLetters.length, 50);
    // The most recently added letter (index 54) should be at the beginning of the array
    assert.strictEqual(storedLetters[0].title, 'Letter 54');
    // The letter added at index 5 should be the last one
    assert.strictEqual(storedLetters[49].title, 'Letter 5');
  });

  test('should gracefully handle invalid JSON for letters in localStorage by returning default empty list', async () => {
    const userId = 'user123';
    localStorage.setItem('axm_local_letters', '{ invalid json ]');

    const result = await localStore.saveLetter(userId, { title: 'Test Letter' });
    assert.ok(result);
    assert.strictEqual(result.title, 'Test Letter');
  });

  test('should gracefully handle non-array JSON for letters in localStorage', async () => {
    const userId = 'user123';
    localStorage.setItem('axm_local_letters', '"string instead of array"');

    const result = await localStore.saveLetter(userId, { title: 'Test Letter' });
    assert.ok(result);
    assert.strictEqual(result.title, 'Test Letter');
  });

  test('should gracefully handle error if localStorage.setItem fails (e.g. QuotaExceededError)', async () => {
    const userId = 'user123';
    const originalSetItem = localStorage.setItem;

    // Mock QuotaExceededError
    localStorage.setItem = () => {
      throw new Error('QuotaExceededError');
    };

    try {
      const result = await localStore.saveLetter(userId, { title: 'Test Letter' });
      assert.ok(result);
      assert.strictEqual(result.title, 'Test Letter');
    } finally {
      // Restore setItem
      localStorage.setItem = originalSetItem;
    }
  });

  test('should handle missing or null letterData gracefully by providing default empty object properties', async () => {
    const userId = 'user123';

    // Test with missing status in letterData to verify default draft
    const result = await localStore.saveLetter(userId, { title: 'Another Letter' });
    assert.strictEqual(result.status, 'draft');

    // Passing null should be gracefully handled
    const resultWithNull = await localStore.saveLetter(userId, null);
    assert.ok(resultWithNull);
    assert.strictEqual(resultWithNull.status, 'draft');
  });
});

describe('localStore.getLetters', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should return empty array if no letters exist', async () => {
    const result = await localStore.getLetters('user123');
    assert.deepStrictEqual(result, []);
  });

  test('should return only letters for the specified user', async () => {
    const user1 = 'user1';
    const user2 = 'user2';

    await localStore.saveLetter(user1, { title: 'User 1 Letter A' });
    await localStore.saveLetter(user2, { title: 'User 2 Letter' });
    await localStore.saveLetter(user1, { title: 'User 1 Letter B' });

    const user1Letters = await localStore.getLetters(user1);
    assert.strictEqual(user1Letters.length, 2);
    assert.strictEqual(user1Letters[0].title, 'User 1 Letter B'); // Assuming unshift order
    assert.strictEqual(user1Letters[1].title, 'User 1 Letter A');
    assert.strictEqual(user1Letters[0].user_id, user1);
    assert.strictEqual(user1Letters[1].user_id, user1);

    const user2Letters = await localStore.getLetters(user2);
    assert.strictEqual(user2Letters.length, 1);
    assert.strictEqual(user2Letters[0].title, 'User 2 Letter');
    assert.strictEqual(user2Letters[0].user_id, user2);

    const user3Letters = await localStore.getLetters('user3');
    assert.deepStrictEqual(user3Letters, []);
  });

  test('should gracefully handle invalid JSON for letters in localStorage by returning empty array', async () => {
    localStorage.setItem('axm_local_letters', 'not a json array');
    const result = await localStore.getLetters('user123');
    assert.deepStrictEqual(result, []);
  });

  test('should gracefully return empty array if the stored letters is not an array (e.g., an object)', async () => {
    const user1 = 'user1';
    localStorage.setItem('axm_local_letters', JSON.stringify({ 'a': 1 }));
    const result = await localStore.getLetters(user1);
    assert.deepStrictEqual(result, []);
  });

  test('should return empty array if getLetters is called without arguments', async () => {
    const result = await localStore.getLetters();
    assert.deepStrictEqual(result, []);
  });

  test('should gracefully handle error if localStorage.getItem throws an exception by returning default empty array', async () => {
    const originalGetItem = localStorage.getItem;
    localStorage.getItem = () => {
      throw new Error('Access denied');
    };

    try {
      const result = await localStore.getLetters('user123');
      assert.deepStrictEqual(result, []);
    } finally {
      localStorage.getItem = originalGetItem;
    }
  });

  test('should correctly retrieve all letters if user matches', async () => {
    await localStore.saveLetter('user_x', { title: 'Test 1' });
    await localStore.saveLetter('user_x', { title: 'Test 2' });

    const result = await localStore.getLetters('user_x');
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0].title, 'Test 2');
    assert.strictEqual(result[1].title, 'Test 1');
  });
});
