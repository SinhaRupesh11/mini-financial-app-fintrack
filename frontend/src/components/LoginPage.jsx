import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { Card, Button, InputField, Message } from './CommonComponents.jsx';

export const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, error, isLoading, clearError } = useAuth();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState(null);

    const from = location.state?.from?.pathname || "/dashboard";

    useEffect(() => {
        clearError();
        if (location.state?.signupSuccess) {
            setMessage({ type: 'success', text: 'Signup successful! Please log in.' });
            navigate(location.pathname, { replace: true, state: {} }); 
        }
    }, [location.state, location.pathname, navigate, clearError]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (message) setMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            navigate(from, { replace: true });
        } catch (err) {
            // Error handling is managed by AuthContext
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card title="Welcome Back" className="w-full max-w-md">
                {(error || message) && (
                    <Message 
                        type={error ? 'error' : message?.type} 
                        text={error || message?.text}
                        onClose={error ? clearError : () => setMessage(null)}
                    />
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit" loading={isLoading} disabled={isLoading} className="w-full">
                        {isLoading ? 'Logging In...' : 'Log In'}
                    </Button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-purple-600 font-semibold hover:text-purple-800">
                        Sign Up
                    </Link>
                </p>
            </Card>
        </div>
    );
};