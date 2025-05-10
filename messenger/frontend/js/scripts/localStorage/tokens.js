const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * Retrieve the token from localStorage.
 * @returns {string|null} The accessToken or null if the token does not exist.
 */
export function getAccessToken() {
    try {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        return token ? token : null;
    } catch (error) {
        console.error('Error retrieving access token from localStorage:', error);
        return null;
    }
}

/**
 * Save the token to localStorage.
 * @param {string} token - The token to save.
 */
export function setAccessToken(token) {
    try {
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    } catch (error) {
        console.error('Error saving token to localStorage:', error);
    }
}

/**
 * Remove the token from localStorage.
 */
export function removeAccessToken() {
    try {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    } catch (error) {
        console.error('Error removing token from localStorage:', error);
    }
}


/**
 * Retrieve the token from localStorage.
 * @returns {string|null} The refreshToken or null if the token does not exist.
 */
export function getRefreshToken() {
    try {
        const token = localStorage.getItem(REFRESH_TOKEN_KEY);
        return token ? token : null;
    } catch (error) {
        console.error('Error retrieving refresh token from localStorage:', error);
        return null;
    }
}

/**
 * Save the token to localStorage.
 * @param {string} token - The token to save.
 */
export function setRefreshToken(token) {
    try {
        localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } catch (error) {
        console.error('Error saving token to localStorage:', error);
    }
}

/**
 * Remove the token from localStorage.
 */
export function removeRefreshToken() {
    try {
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch (error) {
        console.error('Error removing token from localStorage:', error);
    }
}