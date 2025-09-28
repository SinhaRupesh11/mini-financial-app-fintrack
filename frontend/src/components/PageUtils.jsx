import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { Spinner } from './CommonComponents.jsx';

// --- Helper Functions ---
export const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);
};

// --- Private Route Component ---
export const PrivateRoute = ({ element: Component }) => {
    const { isAuthenticated, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Spinner />
            </div>
        );
    }

    // Redirect unauthenticated users to the login page
    return isAuthenticated ? <Component /> : <Navigate to="/login" replace />;
};