import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { Card, Button, InputField, Message } from './CommonComponents.jsx';

export const SignupPage = () => {
    const navigate = useNavigate();
    const { register, error, isLoading, clearError } = useAuth();
    const [formData, setFormData] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        panNumber: '',
        // Initialize with a default path for the simulation
        idImagePath: 'dummy/path/id.jpg' 
    });

    useEffect(() => {
        clearError();
    }, [clearError]);

    const handleChange = (e) => {
        // If the user types in the text input, update the state
        if (e.target.name === 'idImagePath') {
            setFormData({ ...formData, idImagePath: e.target.value });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // The formData already contains idImagePath, either the default or user-entered text
            await register(formData);
            // Navigate to login page on success
            navigate('/login', { state: { signupSuccess: true } });
        } catch (err) {
            // Error handling managed by AuthContext
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card title="Create Account & KYC" className="w-full max-w-md">
                {error && <Message type="error" text={error} onClose={clearError} />}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-700 mt-4 border-b pb-1">Basic Details</h3>
                    <InputField
                        label="Full Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <InputField
                        label="Password (min 6 chars)"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        minLength="6"
                        required
                    />
                    
                    <h3 className="text-lg font-medium text-gray-700 mt-6 border-b pb-1">KYC (Simulated)</h3>
                    <InputField
                        label="PAN Number"
                        type="text"
                        name="panNumber"
                        value={formData.panNumber}
                        onChange={handleChange}
                        maxLength="10"
                        required
                    />
                    {/* Simulated File Upload Input */}
                    <InputField
                        label="Simulated ID Image Path"
                        type="text"
                        name="idImagePath"
                        value={formData.idImagePath}
                        onChange={handleChange}
                        placeholder="e.g., /user/docs/unique_id_123.jpg"
                        required
                    />
                    <p className="text-xs text-gray-500 -mt-2">
                        *Enter any unique path or accept the default for simulation purposes.
                    </p>

                    <Button type="submit" loading={isLoading} disabled={isLoading} className="w-full">
                        {isLoading ? 'Creating Account...' : 'Sign Up & Complete KYC'}
                    </Button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already registered?{' '}
                    <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-800">
                        Log In
                    </Link>
                </p>
            </Card>
        </div>
    );
};