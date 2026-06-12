/**
 * AXiM Client-Side Cryptographic Envelope
 * Wraps JSON payloads in AES-256-GCM encryption using the Web Crypto API.
 */
export const encryptPayload = async (payloadObj, secretKeyString) => {
  try {
    const encoder = new TextEncoder();

    // 1. Hash the environment secret to derive a valid 256-bit key buffer
    const keyMaterial = encoder.encode(secretKeyString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyMaterial);

    // 2. Import Key for AES-GCM
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      hashBuffer,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    // 3. Generate Initialization Vector & Encrypt
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedPayload = encoder.encode(JSON.stringify(payloadObj));
    const encryptedBuffer = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      cryptoKey,
      encodedPayload
    );

    // 4. Transform to Base64 for safe HTTP transmission
    const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
    const ciphertext = btoa(String.fromCharCode.apply(null, encryptedArray));
    const ivBase64 = btoa(String.fromCharCode.apply(null, Array.from(iv)));

    return { ciphertext, iv: ivBase64 };
  } catch (error) {
    console.error("[AXiM_CRYPTO] Payload encryption failed:", error);
    throw new Error("Cryptographic failure");
  }
};
