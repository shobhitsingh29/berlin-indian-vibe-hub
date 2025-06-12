/**
 * Auth utilities for API requests
 */

/**
 * Get the authentication token from localStorage
 * @returns {string | null} The auth token or null if not found
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Set the authentication token in localStorage
 * @param {string} token - The JWT token to store
 */
export const setAuthToken = (token: string): void => {
  if (token) {
    localStorage.setItem('token', token);
  }
};

/**
 * Remove the authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * Get the authorization header with the JWT token
 * @returns {Object} Headers object with Authorization header if token exists
 */
export const getAuthHeader = (): { Authorization?: string } => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
