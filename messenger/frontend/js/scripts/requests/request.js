// import { getAccessToken } from '/js/scripts/localStorage/tokens.js';

/**
 * Makes an API request using a token from localStorage.
 * @param {string} url - The API URL.
 * @param {Object} options - Options for the fetch request.
 * @returns {Promise<any>} The API response.
 */
export async function fetchAPIWithToken(url, options = {}, isJSON = true) {
    // Retrieve the token
    // const token = getAccessToken();
    
    if (!token) {
        console.error('Token is missing. User is not authenticated.');
        return null;
    }

    // Add the token to the Authorization header
    const headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (response.ok) {
            if (isJSON) {
                return await response.json();
            } else {
                return await response.text();
            }
        } else {
            console.error('API error:', response.status, response.statusText);
            // Optional: handle specific errors (e.g., token expired)
            if (response.status === 401) {
                console.warn('Token has expired or is invalid.');
                removeAccessToken();
            }
            return null;
        }
    } catch (error) {
        console.error('Network or request error:', error);
        return null;
    }
}