import test, { describe, it } from 'node:test';
import assert from 'node:assert';
import * as thirdwebClientModule from './thirdweb-client.js';

describe('thirdweb-client configuration', () => {

  it('exports a valid thirdweb client', () => {
    const client = thirdwebClientModule.client;
    assert.strictEqual(typeof client, 'object', 'Client must be an object');
    assert.ok('clientId' in client, 'Client must contain a clientId property');
  });

  // Under `vite-node` testing:
  // `import.meta.env` behaves effectively as a getter mapping to process.env.
  // Furthermore, `thirdweb` exports are defined as getters so they cannot be mocked via standard means.
  // Thus, we verify that the generation of the exported client correctly matches
  // the expected state mapping from `import.meta.env`.

  it('correctly uses the environment variable or fallback to instantiate the client', () => {
    const expectedClientId = import.meta.env?.VITE_THIRDWEB_CLIENT_ID || 'default_client_id';
    assert.strictEqual(thirdwebClientModule.client.clientId, expectedClientId);
  });

});
