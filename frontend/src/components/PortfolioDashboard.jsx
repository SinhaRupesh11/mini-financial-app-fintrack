import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx'; 
import { api } from '../utils/api.js';
// CRITICAL FIX: Import Button component here
import { Card, MetricCard, Message, Spinner, Button } from './CommonComponents.jsx';
import { formatCurrency } from './PageUtils.jsx';
import { Wallet, TrendingUp, DollarSign } from 'lucide-react';

export const PortfolioDashboard = () => {
    const [portfolio, setPortfolio] = useState(null);
    const [watchlistItems, setWatchlistItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, fetchUser } = useAuth(); 
    const navigate = useNavigate();

    // Fetch user data on mount to ensure balance is current after refresh
    useEffect(() => {
        // Run fetchUser if user data is missing (e.g., after initial mount or token refresh)
        if (!user && !loading) {
             fetchUser();
        }
    }, [user, loading, fetchUser]);


    const fetchPortfolio = useCallback(async () => {
        try {
            // Sequential fetch for stability
            const portfolioRes = await api.get('/portfolio');
            setPortfolio(portfolioRes.data);
            
            const watchlistRes = await api.get('/watchlist');
            setWatchlistItems(watchlistRes.data);
            
            setLoading(false);
        } catch (err) {
            console.error(err);
            // Check if error is 401/403 to avoid persistent message when token is invalid
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                 setError("Session expired or invalid. Please log in.");
            } else {
                 setError("Failed to fetch portfolio data. Please try logging in again.");
            }
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Ensure user object is present before attempting to fetch sensitive data
        if (user) {
            fetchPortfolio();
        } 
    }, [user, fetchPortfolio]); // Dependency on user ensures fetch runs when user data arrives

    const returnsColor = (returns) => {
        if (returns > 0) return 'green';
        if (returns < 0) return 'red';
        return 'gray';
    };

    const returnsSign = (returns) => {
        if (returns > 0) return '+';
        return '';
    };

    const summary = useMemo(() => {
        // Ensure portfolio is not null before calculating summary
        if (!portfolio) return null;
        return {
            totalInvested: portfolio.totalInvested || 0,
            currentValue: portfolio.currentValue || 0,
            returns: (portfolio.currentValue || 0) - (portfolio.totalInvested || 0)
        };
    }, [portfolio]);


    if (loading || !user) {
        return (
            <div className="py-10 flex justify-center"><Spinner /></div>
        );
    }
    
    if (error) {
        return <Message type="error" text={error} />;
    }

    // CRITICAL GUARD: Do not render anything below if summary is null (data hasn't finished loading or failed)
    if (!summary) {
        return <Message type="info" text="Portfolio is loading or empty." />;
    }


    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">My Portfolio</h2>
            
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <MetricCard 
                    title="Wallet Balance" 
                    value={formatCurrency(user?.walletBalance || 0)} // Optional chaining for safety
                    icon={Wallet} 
                    color="purple"
                />
                <MetricCard 
                    title="Total Invested" 
                    value={formatCurrency(summary.totalInvested)}
                    icon={DollarSign} 
                    color="blue"
                />
                <MetricCard 
                    title="Current Value" 
                    value={formatCurrency(summary.currentValue)}
                    icon={TrendingUp} 
                    color="orange"
                />
                <MetricCard 
                    title="Total Returns" 
                    value={`${returnsSign(summary.returns)}${formatCurrency(summary.returns)}`}
                    icon={TrendingUp} 
                    color={returnsColor(summary.returns)}
                />
            </div>

            <div className="grid grid-cols-1 lg:col-span-3 gap-8">
                
                {/* Portfolio Holdings Table */}
                <div className="lg:col-span-2">
                    <Card title="Current Holdings" className="p-0">
                        {portfolio?.holdings?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invested</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Returns</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {portfolio.holdings.map((holding) => {
                                            const holdingReturns = holding.currentValue - holding.totalInvested;
                                            return (
                                                <tr key={holding.product._id} className="hover:bg-gray-50 transition duration-150 ease-in-out cursor-pointer" onClick={() => navigate(`/product/${holding.product._id}`)}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{holding.product.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{holding.units}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(holding.totalInvested)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(holding.currentValue)}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold" style={{ color: returnsColor(holdingReturns) === 'red' ? '#ef4444' : (returnsColor(holdingReturns) === 'green' ? '#10b981' : '#6b7280') }}>
                                                        {returnsSign(holdingReturns)}{formatCurrency(holdingReturns)}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="p-6 text-center text-gray-500">You have no current holdings. Buy your first product from the <Link to="/dashboard" className="text-purple-600 hover:underline">Dashboard</Link>.</p>
                        )}
                    </Card>
                </div>
                
                {/* Watchlist Panel */}
                <div className="lg:col-span-1">
                    <Card title="Watchlist">
                        {watchlistItems.length > 0 ? (
                            <ul className="space-y-3">
                                {/* Filter ensures we don't try to render an item if the product data is missing */}
                                {watchlistItems.filter(item => item.product).map((item) => ( 
                                    <li key={item.product._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg shadow-sm">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-800">{item.product.name}</span>
                                            <span className="text-xs text-gray-500">{formatCurrency(item.product.pricePerUnit)}</span>
                                        </div>
                                        <Button 
                                            onClick={() => navigate(`/product/${item.product._id}`)} 
                                            variant="secondary"
                                            size="sm"
                                        >
                                            View
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500">Your watchlist is empty.</p>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};
