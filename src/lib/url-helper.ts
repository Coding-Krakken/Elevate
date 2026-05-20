/**
 * Get the base URL for the application
 * - Production: Uses PRODUCTION_URL environment variable (for invite links)
 * - Preview/Development: Falls back to VERCEL_URL or localhost
 * - Handles both server-side and client-side contexts
 */
export function getBaseUrl(): string {
  // Client-side: use window.location.origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // Server-side: prioritize PRODUCTION_URL for invite links
  if (process.env.PRODUCTION_URL) {
    return process.env.PRODUCTION_URL;
  }

  // Fallback to Vercel deployment URL
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
