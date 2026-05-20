/**
 * Get the base URL for the application
 * - In production (Vercel): Uses VERCEL_URL environment variable
 * - In development: Uses localhost with PORT or default 3000
 * - Handles both server-side and client-side contexts
 */
export function getBaseUrl(): string {
  // Client-side: use window.location.origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Server-side: check for Vercel environment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Development: use localhost
  const port = process.env.PORT || 3000;
  return `http://localhost:${port}`;
}

/**
 * Build a full URL from a path
 * @param path - The path to append to the base URL (should start with /)
 */
export function buildUrl(path: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}${path}`;
}
