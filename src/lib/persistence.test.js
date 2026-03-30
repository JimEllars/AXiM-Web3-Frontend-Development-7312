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

global.localStorage = localStorageMock;

describe('localStore.getProfile', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should return null when address is null', () => {
    const result = localStore.getProfile(null);
    assert.strictEqual(result, null);
  });

  test('should return null when address is undefined', () => {
    const result = localStore.getProfile(undefined);
    assert.strictEqual(result, null);
  });

  test('should return null when getProfile is called without arguments', () => {
    const result = localStore.getProfile();
    assert.strictEqual(result, null);
  });

  test('should return null when address is empty string', () => {
    const result = localStore.getProfile('');
    assert.strictEqual(result, null);
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

  test('should throw SyntaxError if localStorage contains invalid JSON', () => {
    const address = '0x123';
    localStorage.setItem('axm_local_profiles', 'invalid json data');

    assert.throws(() => {
      localStore.getProfile(address);
    }, SyntaxError);
  });
});

describe('localStore.saveLetter', () => {
  beforeEach(() => {
    localStorage.clear();
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

  test('should throw SyntaxError if localStorage contains invalid JSON for letters', () => {
    const userId = 'user123';
    localStorage.setItem('axm_local_letters', '{ invalid json ]');

    assert.throws(() => {
      localStore.saveLetter(userId, { title: 'Test Letter' });
    }, SyntaxError);
  });

  test('should throw error if localStorage.setItem fails (e.g. QuotaExceededError)', () => {
    const userId = 'user123';
    const originalSetItem = localStorage.setItem;

    // Mock QuotaExceededError
    localStorage.setItem = () => {
      throw new Error('QuotaExceededError');
    };

    try {
      assert.throws(() => {
        localStore.saveLetter(userId, { title: 'Test Letter' });
      }, /QuotaExceededError/);
    } finally {
      // Restore setItem
      localStorage.setItem = originalSetItem;
    }
  });
});

describe('localStore.getLetters', () => {
  beforeEach(() => {
    localStorage.clear();
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

  test('should throw SyntaxError if localStorage contains invalid JSON for letters in getLetters', () => {
    localStorage.setItem('axm_local_letters', 'not a json array');
    assert.throws(() => {
      localStore.getLetters('user123');
    }, SyntaxError);
  });
});
