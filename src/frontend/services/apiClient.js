/**
 * Frontend Universal API Client
 * Clean abstraction for frontend components to interact with Backend API endpoints.
 */

export async function apiRequest(endpoint, options = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
    };

    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(endpoint, config);
        const data = await response.json();
        return { status: response.status, ok: response.ok, data };
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        return { status: 500, ok: false, data: { success: false, message: error.message } };
    }
}

export const authAPI = {
    getUserProfile: () => apiRequest('/api/auth/me'),
    login: (credentials) => apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    sendOtp: (phone) => apiRequest('/api/auth/otp', { method: 'POST', body: JSON.stringify({ phoneNumber: phone }) }),
    verifyOtp: (payload) => apiRequest('/api/auth/verify-otp', { method: 'POST', body: JSON.stringify(payload) }),
    logout: () => apiRequest('/api/auth/logout', { method: 'POST' }),
};

export const bookingAPI = {
    createBooking: (bookingData) => apiRequest('/api/bookings', { method: 'POST', body: JSON.stringify(bookingData) }),
    getUserBookings: () => apiRequest('/api/bookings'),
};
