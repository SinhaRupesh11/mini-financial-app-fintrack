import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// CRITICAL FIX: Explicitly importing all components from the './components/' folder with .jsx extension.
import { useAuth, AuthProvider } from './components/AuthContext.jsx'; 
import { PrivateRoute } from './components/PageUtils.jsx';
import { Layout } from './components/Layout.jsx';
import { LoginPage } from './components/LoginPage.jsx';
import { SignupPage } from './components/SignupPage.jsx';
import { ProductList } from './components/ProductList.jsx';
import { ProductDetailPage } from './components/ProductDetailPage.jsx';
import { PortfolioDashboard } from './components/PortfolioDashboard.jsx';

// --- Loading Component (Placeholder for blank screen) ---
const FullScreenLoader = () => (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-purple-600 animate-pulse text-xl">Loading Application...</div>
    </div>
);


// --- App Content (Routing Logic) ---
const AppContent = () => {
    // Access the loading state from context. This prevents the crash.
    const { loading } = useAuth(); 

    // CRITICAL FIX: If loading is true, render ONLY the loader.
    if (loading) {
        return <FullScreenLoader />;
    }

    // Once loading is false, render the full application structure
    return (
        <Layout>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                
                {/* Protected Routes (Wrapped in PrivateRoute) */}
                <Route path="/dashboard" element={<PrivateRoute element={ProductList} />} />
                <Route path="/portfolio" element={<PrivateRoute element={PortfolioDashboard} />} />
                <Route path="/product/:id" element={<PrivateRoute element={ProductDetailPage} />} />
                
                {/* Default / Home Route (Redirects to Dashboard if logged in) */}
                <Route path="/" element={<PrivateRoute element={ProductList} />} />
                
                {/* Fallback */}
                <Route path="*" element={<div className="p-8 text-center text-red-600">404 - Page Not Found</div>} />
            </Routes>
        </Layout>
    );
};

// --- Main Export (Context Provider) ---
export default function App() {
    return (
        <Router>
            {/* AuthProvider wraps the entire application, providing context */}
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </Router>
    );
};
