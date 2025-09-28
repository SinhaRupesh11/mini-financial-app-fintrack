import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api.js';

// --- 1. Create the Context ---
const AuthContext = createContext();

// --- 2. Custom Hook for easy consumption ---
// Export the hook here, separate from the provider
export const useAuth = () => {
    return useContext(AuthContext);
};

// --- 3. Create the Provider Component ---
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const clearError = useCallback(() => setError(null), []);

    // Function to fetch full user details
    const fetchUser = useCallback(async () => {
        try {
            const res = await api.get('/auth/me');
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (err) {
            console.error("Failed to fetch user:", err);
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
        }
    }, []);

    // Initial check for token and user data fetch on mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        const initializeAuth = async () => {
            if (token) {
                await fetchUser();
            }
            setLoading(false);
        };

        initializeAuth();
    }, [fetchUser]);

    const register = async (userData) => {
        clearError();
        setIsLoading(true);
        try {
            await api.post('/auth/signup', userData);
        } catch (err) {
            const msg = err.response?.data?.msg || 'Registration failed due to server error.';
            setError(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        clearError();
        setIsLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            
            localStorage.setItem('token', res.data.token);
            setIsAuthenticated(true);

            await fetchUser();
        } catch (err) {
            const msg = err.response?.data?.msg || 'Login failed. Check credentials.';
            setError(msg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        navigate('/login', { replace: true });
    };

    const updateUser = (data) => {
        setUser(prevUser => ({ ...prevUser, ...data }));
    };

    const value = useMemo(() => ({
        isAuthenticated,
        user,
        loading,
        error,
        isLoading,
        login,
        logout,
        register,
        clearError,
        updateUser,
        fetchUser 
    }), [isAuthenticated, user, loading, error, isLoading, clearError, fetchUser]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
