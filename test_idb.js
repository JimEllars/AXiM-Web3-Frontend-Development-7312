// I need to patch persistence.test.js because the fallback key generation inside persistence.js
// is completely independent from the fallback key generation inside the test. They will generate
// two different keys and decryption will fail.
// So let's mock crypto.subtle.generateKey to always return the same key for testing.
