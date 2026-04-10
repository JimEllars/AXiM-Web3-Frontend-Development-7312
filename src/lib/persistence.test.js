import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { localStore } from './persistence.js';

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

describe('localStore.getProfile', () => {
  beforeEach(() => {
    localStorage.clear();
    localStore.clearCache();
  });

  test('should return null when address is null', () => {
    let getItemCalled = false;
    const originalGetItem = localStorage.getItem;
    try {
      localStorage.getItem = (...args) => {
        getItemCalled = true;
        return originalGetItem(...args);
      };
      const result = localStore.getProfile(null);
      assert.strictEqual(result, null);
      assert.strictEqual(getItemCalled, false, 'localStorage.getItem should not be called when address is null');
    } finally {
      localStorage.getItem = originalGetItem;
    }
  });

  test('should return null when address is undefined', () => {
    let getItemCalled = false;
    const originalGetItem = localStorage.getItem;
    try {
      localStorage.getItem = (...args) => {
        getItemCalled = true;
        return originalGetItem(...args);
      };
      const result = localStore.getProfile(undefined);
      assert.strictEqual(result, null);
      assert.strictEqual(getItemCalled, false, 'localStorage.getItem should not be called when address is undefined');
    } finally {
      localStorage.getItem = originalGetItem;
    }
  });

  test('should return null when getProfile is called without arguments', () => {
    let getItemCalled = false;
    const originalGetItem = localStorage.getItem;

    try {
      localStorage.getItem = (...args) => {
        getItemCalled = true;
        return originalGetItem(...args);
      };

      const result = localStore.getProfile();
      assert.strictEqual(result, null);
      assert.strictEqual(getItemCalled, false, 'localStorage.getItem should not be called when address is missing');
    } finally {
      localStorage.getItem = originalGetItem;
    }
  });

  test('should return null when address is empty string', () => {
    let getItemCalled = false;
    const originalGetItem = localStorage.getItem;
    try {
      localStorage.getItem = (...args) => {
        getItemCalled = true;
        return originalGetItem(...args);
      };
      const result = localStore.getProfile('');
      assert.strictEqual(result, null);
      assert.strictEqual(getItemCalled, false, 'localStorage.getItem should not be called when address is empty string');
    } finally {
      localStorage.getItem = originalGetItem;
    }
  });

  test('should create and return a new profile for a valid address', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    const result = localStore.getProfile(address);

    assert.ok(result);
    assert.strictEqual(result.wallet_address, address);
    assert.strictEqual(result.id, `local-${address.slice(0, 8)}`);
    assert.strictEqual(result.clearance_level, 1);
    assert.strictEqual(result.is_mock, true);
    assert.ok(result.created_at);

    // Verify it was saved to localStorage
    const storedProfiles = JSON.parse(localStorage.getItem('axm_local_profiles'));
    assert.ok(storedProfiles[address]);
    assert.deepStrictEqual(storedProfiles[address], result);
  });

  test('should return existing profile from localStorage', () => {
    const address = '0xexisting';
    const existingProfile = {
      id: 'local-0xexistin',
      wallet_address: address,
      clearance_level: 2,
      created_at: '2023-01-01T00:00:00.000Z',
      is_mock: true
    };

    localStorage.setItem('axm_local_profiles', JSON.stringify({ [address]: existingProfile }));

    const result = localStore.getProfile(address);
    assert.deepStrictEqual(result, existingProfile);
  });

  test('should handle invalid JSON in localStorage gracefully by returning a new profile', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    localStorage.setItem('axm_local_profiles', 'invalid json data');

    const result = localStore.getProfile(address);
    assert.ok(result);
    assert.strictEqual(result.wallet_address, address);
    assert.strictEqual(result.id, `local-${address.slice(0, 8)}`);
    assert.strictEqual(result.clearance_level, 1);
  });

  test('should handle non-object JSON in localStorage gracefully by returning a new profile', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    localStorage.setItem('axm_local_profiles', '"string instead of object"');

    const result = localStore.getProfile(address);
    assert.ok(result);
    assert.strictEqual(result.wallet_address, address);
  });

  test('should gracefully handle localStorage.setItem failure in getProfile', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = () => { throw new Error('QuotaExceededError'); };

    try {
      const result = localStore.getProfile(address);
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
    localStore.clearCache();
  });

  test('should save a new letter with generated id, date and draft status', () => {
    const userId = 'user123';
    const letterData = { title: 'Test Letter', content: 'Hello World' };

    const result = localStore.saveLetter(userId, letterData);

    assert.ok(result);
    assert.strictEqual(result.user_id, userId);
    assert.strictEqual(result.title, 'Test Letter');
    assert.strictEqual(result.content, 'Hello World');
    assert.ok(result.id.startsWith('AXM-'));
    assert.strictEqual(result.id, result.id.toUpperCase());
    assert.strictEqual(result.status, 'draft');
    assert.ok(result.created_at);

    // Verify it was saved to localStorage
    const storedLetters = JSON.parse(localStorage.getItem('axm_local_letters'));
    assert.strictEqual(storedLetters.length, 1);
    assert.deepStrictEqual(storedLetters[0], result);
  });

  test('should save a new letter with provided status', () => {
    const userId = 'user123';
    const letterData = { title: 'Test Letter', status: 'published' };

    const result = localStore.saveLetter(userId, letterData);

    assert.strictEqual(result.status, 'published');
  });

  test('should keep only the last 50 letters in localStorage', () => {
    const userId = 'user123';
    for (let i = 0; i < 55; i++) {
      localStore.saveLetter(userId, { title: `Letter ${i}` });
    }

    const storedLetters = JSON.parse(localStorage.getItem('axm_local_letters'));
    assert.strictEqual(storedLetters.length, 50);
    // The most recently added letter (index 54) should be at the beginning of the array
    assert.strictEqual(storedLetters[0].title, 'Letter 54');
    // The letter added at index 5 should be the last one
    assert.strictEqual(storedLetters[49].title, 'Letter 5');
  });

  test('should gracefully handle invalid JSON for letters in localStorage by returning default empty list', () => {
    const userId = 'user123';
    localStorage.setItem('axm_local_letters', '{ invalid json ]');

    const result = localStore.saveLetter(userId, { title: 'Test Letter' });
    assert.ok(result);
    assert.strictEqual(result.title, 'Test Letter');
  });

  test('should gracefully handle non-array JSON for letters in localStorage', () => {
    const userId = 'user123';
    localStorage.setItem('axm_local_letters', '"string instead of array"');

    const result = localStore.saveLetter(userId, { title: 'Test Letter' });
    assert.ok(result);
    assert.strictEqual(result.title, 'Test Letter');
  });

  test('should gracefully handle error if localStorage.setItem fails (e.g. QuotaExceededError)', () => {
    const userId = 'user123';
    const originalSetItem = localStorage.setItem;

    // Mock QuotaExceededError
    localStorage.setItem = () => {
      throw new Error('QuotaExceededError');
    };

    try {
      const result = localStore.saveLetter(userId, { title: 'Test Letter' });
      assert.ok(result);
      assert.strictEqual(result.title, 'Test Letter');
    } finally {
      // Restore setItem
      localStorage.setItem = originalSetItem;
    }
  });

  test('should handle missing or null letterData gracefully by providing default empty object properties', () => {
    const userId = 'user123';

    // Test with missing status in letterData to verify default draft
    const result = localStore.saveLetter(userId, { title: 'Another Letter' });
    assert.strictEqual(result.status, 'draft');

    // Passing null should be gracefully handled
    const resultWithNull = localStore.saveLetter(userId, null);
    assert.ok(resultWithNull);
    assert.strictEqual(resultWithNull.status, 'draft');
  });
});

describe('localStore.getLetters', () => {
  beforeEach(() => {
    localStorage.clear();
    localStore.clearCache();
  });

  test('should return empty array if no letters exist', () => {
    const result = localStore.getLetters('user123');
    assert.deepStrictEqual(result, []);
  });

  test('should return only letters for the specified user', () => {
    const user1 = 'user1';
    const user2 = 'user2';

    localStore.saveLetter(user1, { title: 'User 1 Letter A' });
    localStore.saveLetter(user2, { title: 'User 2 Letter' });
    localStore.saveLetter(user1, { title: 'User 1 Letter B' });

    const user1Letters = localStore.getLetters(user1);
    assert.strictEqual(user1Letters.length, 2);
    assert.strictEqual(user1Letters[0].title, 'User 1 Letter B'); // Assuming unshift order
    assert.strictEqual(user1Letters[1].title, 'User 1 Letter A');
    assert.strictEqual(user1Letters[0].user_id, user1);
    assert.strictEqual(user1Letters[1].user_id, user1);

    const user2Letters = localStore.getLetters(user2);
    assert.strictEqual(user2Letters.length, 1);
    assert.strictEqual(user2Letters[0].title, 'User 2 Letter');
    assert.strictEqual(user2Letters[0].user_id, user2);

    const user3Letters = localStore.getLetters('user3');
    assert.deepStrictEqual(user3Letters, []);
  });

  test('should gracefully handle invalid JSON for letters in localStorage by returning empty array', () => {
    localStorage.setItem('axm_local_letters', 'not a json array');
    const result = localStore.getLetters('user123');
    assert.deepStrictEqual(result, []);
  });

  test('should gracefully return empty array if the stored letters is not an array (e.g., an object)', () => {
    const user1 = 'user1';
    localStorage.setItem('axm_local_letters', JSON.stringify({ 'a': 1 }));
    const result = localStore.getLetters(user1);
    assert.deepStrictEqual(result, []);
  });
});
