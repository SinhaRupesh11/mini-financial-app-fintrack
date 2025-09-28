import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx'; 
import { api } from '../utils/api.js'; 
import { Card, Button, MetricCard, Message, Spinner } from './CommonComponents.jsx';
import { formatCurrency } from './PageUtils.jsx';
import { Eye, EyeOff, Wallet, TrendingUp } from 'lucide-react';

export const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, fetchUser } = useAuth(); 
    const navigate = useNavigate();

    const fetchProducts = useCallback(async () => {
        setError(null);
        setLoading(true);

        try {
            const productsRes = await api.get('/products');
            setProducts(productsRes.data);
            
            const watchlistRes = await api.get('/watchlist');
            setWatchlist(watchlistRes.data.map(item => item.product._id));
            
            setLoading(false);
        } catch (err) {
            console.error("Dashboard Fetch Error:", err);
            setError("Failed to fetch products or watchlist. Please try logging in again.");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchProducts();
        } else {
             setLoading(false);
        }
    }, [user, fetchProducts]);

    const toggleWatchlist = async (productId, isWatching) => {
        try {
            if (isWatching) {
                await api.delete(`/watchlist/${productId}`);
                setWatchlist(watchlist.filter(id => id !== productId));
            } else {
                await api.post('/watchlist', { productId });
                setWatchlist([...watchlist, productId]);
            }
        } catch (err) {
            console.error("Watchlist update failed:", err);
            setError("Failed to update watchlist.");
        }
    };

    if (loading) {
        return (
            <div className="py-10 flex justify-center"><Spinner /></div>
        );
    }
    
    if (error) {
        return <Message type="error" text={error} />;
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Investment Dashboard</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MetricCard 
                    title="Wallet Balance" 
                    value={formatCurrency(user?.walletBalance || 0)}
                    icon={Wallet} 
                    color="green"
                />
                <MetricCard 
                    title="Total Products" 
                    value={products.length}
                    icon={TrendingUp} 
                    color="purple"
                />
                <MetricCard 
                    title="Watchlist Items" 
                    value={watchlist.length}
                    icon={Eye} 
                    color="blue"
                />
            </div>

            <Card title="Available Investment Products" className="p-0">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (Unit)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Key Metric</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => {
                                const isWatching = watchlist.includes(product._id);
                                return (
                                    <tr key={product._id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.pricePerUnit)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">P/E: {product.keyMetric}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex space-x-2">
                                            <Button 
                                                onClick={() => navigate(`/product/${product._id}`)} 
                                                variant="secondary"
                                                size="sm"
                                            >
                                                Details
                                            </Button>
                                            <Button 
                                                onClick={() => toggleWatchlist(product._id, isWatching)}
                                                variant={isWatching ? "danger" : "primary"}
                                                size="sm"
                                                icon={isWatching ? EyeOff : Eye}
                                            >
                                                {isWatching ? 'Unwatch' : 'Watch'}
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};