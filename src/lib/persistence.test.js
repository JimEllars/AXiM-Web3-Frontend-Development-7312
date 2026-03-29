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
});
