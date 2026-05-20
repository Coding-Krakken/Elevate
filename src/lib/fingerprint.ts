'use client';

import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fpPromise: Promise<any> | null = null;

/**
 * Initialize the FingerprintJS agent (singleton pattern)
 */
function getFingerprintAgent() {
  if (!fpPromise) {
    fpPromise = FingerprintJS.load();
  }
  return fpPromise;
}

/**
 * Generate a consistent device fingerprint
 * This fingerprint is based on browser characteristics and should remain
 * stable across sessions unless the browser is significantly updated
 * @returns A hash string representing the device fingerprint
 */
export async function generateDeviceFingerprint(): Promise<string> {
  try {
    const fp = await getFingerprintAgent();
    const result = await fp.get();
    return result.visitorId;
  } catch (error) {
    console.error('Error generating device fingerprint:', error);
    // Fallback: generate a random ID (not ideal but prevents total failure)
    return `fallback-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  }
}

/**
 * Get detailed fingerprint components (for debugging)
 */
export async function getDetailedFingerprint(): Promise<any> {
  const fp = await getFingerprintAgent();
  const result = await fp.get();
  return {
    visitorId: result.visitorId,
    confidence: result.confidence,
    components: result.components,
  };
}
