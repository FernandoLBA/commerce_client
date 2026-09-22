/**
 * Cookie utility functions for authentication
 */

const AUTH_COOKIE_NAME = 'auth_token';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

/**
 * Set the auth token cookie
 */
export function setAuthCookie(token: string): void {
  if (typeof document === 'undefined') return;
  
  // Set cookie with proper attributes for security
  document.cookie = `${AUTH_COOKIE_NAME}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

/**
 * Remove the auth token cookie
 */
export function removeAuthCookie(): void {
  if (typeof document === 'undefined') return;
  
  // Remove cookie by setting max-age to 0
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}

/**
 * Get the auth token from cookie (client-side only)
 */
export function getAuthCookie(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === AUTH_COOKIE_NAME) {
      return value || null;
    }
  }
  return null;
}
