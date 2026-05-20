import { compare, hash } from 'bcryptjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const COOKIE_NAME = 'elevate_device_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

/**
 * Generate a cryptographically secure random token
 * @param bytes - Number of random bytes (default: 32)
 */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString('base64url');
}

/**
 * Hash a token for storage in the database
 * @param token - The plain text token to hash
 */
export async function hashToken(token: string): Promise<string> {
  return hash(token, 10);
}

/**
 * Verify a token against a hash
 * @param token - The plain text token
 * @param hash - The hashed token from the database
 */
export async function verifyToken(token: string, tokenHash: string): Promise<boolean> {
  return compare(token, tokenHash);
}

/**
 * Set the device authentication cookie
 * @param token - The device token to store
 */
export async function setDeviceCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

/**
 * Get the device token from cookies
 */
export async function getDeviceCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

/**
 * Remove the device authentication cookie
 */
export async function removeDeviceCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Generate an invitation token (32 bytes = 256 bits of entropy)
 */
export function generateInvitationToken(): string {
  return generateSecureToken(32);
}

/**
 * Generate a device authentication token (64 bytes = 512 bits of entropy)
 */
export function generateDeviceToken(): string {
  return generateSecureToken(64);
}
