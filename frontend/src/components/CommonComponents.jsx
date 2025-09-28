import React from 'react';
import { Loader2, AlertTriangle, CheckCircle, X } from 'lucide-react';

// --- Spinner Component ---
export const Spinner = () => (
    <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
    </div>
);

// --- Message/Alert Component ---
export const Message = ({ type, text, onClose }) => {
    if (!text) return null;

    let icon, colorClasses;

    switch (type) {
        case 'success':
            icon = CheckCircle;
            colorClasses = 'bg-green-100 border-green-400 text-green-700';
            break;
        case 'error':
            icon = AlertTriangle;
            colorClasses = 'bg-red-100 border-red-400 text-red-700';
            break;
        case 'info':
        default:
            icon = AlertTriangle;
            colorClasses = 'bg-blue-100 border-blue-400 text-blue-700';
            break;
    }

    const IconComponent = icon;

    return (
        <div className={`p-4 border-l-4 rounded-lg shadow-sm mb-4 flex items-center justify-between ${colorClasses}`} role="alert">
            <div className="flex items-center">
                <IconComponent className="h-5 w-5 mr-3 flex-shrink-0" />
                <p className="text-sm font-medium">{text}</p>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className={`ml-3 -mr-1 p-1 rounded-full hover:bg-opacity-50 transition`}
                >
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

// --- Card Component ---
export const Card = ({ title, children, className = '' }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg border border-gray-100 ${className}`}>
        {title && <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">{title}</h3>}
        {children}
    </div>
);

// --- Button Component ---
export const Button = ({ children, onClick, variant = 'primary', size = 'md', icon: Icon, type = 'button', loading, disabled, className = '' }) => {
    let baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition duration-150 ease-in-out whitespace-nowrap ';
    let sizeStyles;
    let variantStyles;

    switch (size) {
        case 'sm':
            sizeStyles = 'px-3 py-1.5 text-sm';
            break;
        case 'lg':
            sizeStyles = 'px-6 py-3 text-lg';
            break;
        case 'md':
        default:
            sizeStyles = 'px-4 py-2 text-base';
            break;
    }

    switch (variant) {
        case 'secondary':
            variantStyles = 'bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-300';
            break;
        case 'danger':
            variantStyles = 'bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-200';
            break;
        case 'primary':
        default:
            variantStyles = 'bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-200';
            break;
    }
    
    // Disabled/Loading styles
    if (disabled || loading) {
        variantStyles += ' opacity-50 cursor-not-allowed';
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
        >
            {loading ? (
                <Loader2 className={`h-4 w-4 animate-spin ${Icon ? 'mr-2' : ''}`} />
            ) : (
                Icon && <Icon className={`h-4 w-4 ${children ? 'mr-2' : ''}`} />
            )}
            {children}
        </button>
    );
};

// --- InputField Component ---
export const InputField = ({ label, type = 'text', name, value, onChange, required, minLength, maxLength, placeholder, className = '' }) => (
    <div>
        {label && <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            minLength={minLength}
            maxLength={maxLength}
            placeholder={placeholder}
            className={`w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ${className}`}
        />
    </div>
);

// --- Metric Display Component ---
export const Metric = ({ label, value, color = 'gray' }) => {
    let colorClass;
    switch (color) {
        case 'green': colorClass = 'text-green-600 bg-green-50'; break;
        case 'red': colorClass = 'text-red-600 bg-red-50'; break;
        case 'blue': colorClass = 'text-blue-600 bg-blue-50'; break;
        case 'purple': colorClass = 'text-purple-600 bg-purple-50'; break;
        case 'orange': colorClass = 'text-orange-600 bg-orange-50'; break;
        default: colorClass = 'text-gray-600 bg-gray-50'; break;
    }

    return (
        <div className={`p-3 rounded-lg border ${colorClass} text-center`}>
            <p className="text-xs font-medium uppercase opacity-75">{label}</p>
            <p className="text-xl font-bold mt-1">{value}</p>
        </div>
    );
};

// --- Metric Card (for Dashboard Summary) ---
export const MetricCard = ({ title, value, icon: Icon, color = 'gray' }) => {
    let iconBgClass;
    let textClass;

    switch (color) {
        case 'green': iconBgClass = 'bg-green-100 text-green-600'; textClass = 'text-green-600'; break;
        case 'red': iconBgClass = 'bg-red-100 text-red-600'; textClass = 'text-red-600'; break;
        case 'blue': iconBgClass = 'bg-blue-100 text-blue-600'; textClass = 'text-blue-600'; break;
        case 'purple': iconBgClass = 'bg-purple-100 text-purple-600'; textClass = 'text-purple-600'; break;
        case 'orange': iconBgClass = 'bg-orange-100 text-orange-600'; textClass = 'text-orange-600'; break;
        default: iconBgClass = 'bg-gray-100 text-gray-600'; textClass = 'text-gray-600'; break;
    }

    return (
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100 flex items-center space-x-4">
            <div className={`p-3 rounded-full ${iconBgClass}`}>
                {Icon && <Icon className="h-6 w-6" />}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className={`text-2xl font-extrabold ${textClass}`}>{value}</p>
            </div>
        </div>
    );
};