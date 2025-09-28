import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { Button } from './CommonComponents.jsx';
import { LogOut, Home, Briefcase, TrendingUp } from 'lucide-react';

// --- Header/Navigation ---
const Header = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-white shadow-lg border-t-4 border-purple-600 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
                <Link to="/" className="flex items-center space-x-2 text-2xl font-extrabold text-gray-900">
                    <TrendingUp className="h-7 w-7 text-purple-600" />
                    <span>FinTrack</span>
                </Link>

                {isAuthenticated ? (
                    <nav className="flex space-x-4">
                        <Link to="/dashboard" className="text-gray-600 hover:text-purple-600 flex items-center space-x-1 transition duration-150 ease-in-out">
                            <Home className="h-5 w-5" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </Link>
                        <Link to="/portfolio" className="text-gray-600 hover:text-purple-600 flex items-center space-x-1 transition duration-150 ease-in-out">
                            <Briefcase className="h-5 w-5" />
                            <span className="hidden sm:inline">Portfolio</span>
                        </Link>
                        <Button onClick={handleLogout} variant="danger" size="sm" icon={LogOut}>
                            Logout
                        </Button>
                    </nav>
                ) : (
                    <div className="space-x-3">
                        <Link to="/login" className="text-gray-600 hover:text-purple-600 font-medium">
                            Login
                        </Link>
                        <Link to="/signup">
                            <Button size="sm">Sign Up</Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

// --- Footer ---
const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-12 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
                &copy; {currentYear} FinTrack. All rights reserved.
            </div>
        </footer>
    );
};

// --- Layout Component ---
export const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
};
