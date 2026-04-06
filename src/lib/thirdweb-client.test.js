import { test, describe } from 'node:test';
import assert from 'node:assert';
import { client } from './thirdweb-client.js';

describe('thirdweb-client', () => {
  test('should export a client object', () => {
    assert.ok(client, 'client should be defined');
    assert.strictEqual(typeof client, 'object');
  });

  test('should have a clientId property', () => {
    // Standard Thirdweb client has a clientId
    assert.ok(client.clientId, 'clientId should be present');
    assert.strictEqual(typeof client.clientId, 'string');
  });
});
