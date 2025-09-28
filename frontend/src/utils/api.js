import axios from 'axios';

// --- Configuration ---
// Ensure this matches your backend server URL
const API_BASE_URL = 'http://localhost:5000/api'; 

// --- 1. Create the API Instance with Interceptors ---
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor to attach JWT
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        // Attaches the token to the Authorization header
        config.headers['x-auth-token'] = token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Response Interceptor to handle 401 errors globally
api.interceptors.response.use(
    response => response,
    error => {
        // CRITICAL FIX: Check for error.response existence before reading status.
        // This prevents crashes on network errors (e.g., server offline).
        if (error.response?.status === 401) {
            // Clear the invalid token
            localStorage.removeItem('token');
            
            // Force a browser redirect to the login page
            // We use window.location.href because React Router hooks aren't available here.
            window.location.href = '/login'; 
            
            // Return a promise that never resolves to stop downstream .catch() blocks 
            // from running in the component.
            return new Promise(() => {}); 
        }
        
        // For all other errors (404, 500, network errors), pass the error to the component's catch block
        return Promise.reject(error);
    }
);