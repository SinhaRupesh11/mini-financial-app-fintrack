import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from './AuthContext.jsx'; // Only import useAuth
import { api } from '../utils/api.js'; // <-- CORRECTED PATH for API
import { Card, Button, InputField, Metric, MetricCard, Message, Spinner } from './CommonComponents.jsx';
import { formatCurrency } from './PageUtils.jsx';
import { Plus, Minus, Zap, Wallet, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';

export const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, updateUser } = useAuth();
    
    const [product, setProduct] = useState(null);
    const [units, setUnits] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const currentPrice = product?.pricePerUnit || 0;
    const totalCost = units * currentPrice;
    // Check if user is defined before accessing walletBalance
    const canBuy = units > 0 && totalCost <= (user?.walletBalance || 0); 

    const fetchProduct = useCallback(async () => {
        try {
            const res = await api.get(`/products/${id}`);
            setProduct(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setError("Failed to fetch product details.");
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleBuy = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!canBuy) {
            setError("Insufficient balance or invalid number of units.");
            return;
        }

        try {
            const res = await api.post('/transactions/buy', {
                productId: id,
                units: parseInt(units), // CRITICAL FIX: Ensure units is a number
            });
            
            // Update user balance in context using the balance returned from the backend
            updateUser({ walletBalance: res.data.newWalletBalance });
            
            setMessage({ type: 'success', text: `Successfully purchased ${units} units of ${product.name} for ${formatCurrency(totalCost)}!` });
            setUnits(1); // Reset units
        } catch (err) {
            console.error("Purchase failed:", err);
            setError(err.response?.data?.msg || "Transaction failed due to an unknown error.");
        }
    };

    if (loading) {
        return (
            <div className="py-10 flex justify-center"><Spinner /></div>
        );
    }
    
    if (error && !product) {
        return <Message type="error" text={error} />;
    }

    const { name, category, keyMetric, description, marketCap, historicalData } = product;

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Button onClick={() => navigate('/dashboard')} variant="secondary" icon={ArrowRight} className="mb-4">
                Back to Dashboard
            </Button>
            
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">{name}</h2>
            <p className="text-xl text-purple-600 mb-6">{category}</p>

            {message && <Message type={message.type} text={message.text} onClose={() => setMessage(null)} />}
            {error && <Message type="error" text={error} onClose={() => setError(null)} />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* --- Left Column: Trading View & Price Metrics --- */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Price Chart */}
                    <Card title="Historical Price (Simulated)">
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={historicalData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="date" tickFormatter={(v) => new Date(v).toLocaleDateString()} style={{fontSize: '10px'}} />
                                    <YAxis domain={['auto', 'auto']} tickFormatter={(v) => formatCurrency(v)} style={{fontSize: '10px'}} />
                                    <Tooltip 
                                        labelFormatter={(v) => new Date(v).toDateString()}
                                        formatter={(value) => [formatCurrency(value), 'Price']}
                                    />
                                    <Line type="monotone" dataKey="price" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    {/* Description */}
                    <Card title="Product Overview">
                        <p className="text-gray-600">{description}</p>
                    </Card>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                        <MetricCard title="Market Cap" value={formatCurrency(marketCap)} color="blue" icon={DollarSign} />
                        <MetricCard title="P/E Ratio" value={keyMetric} color="orange" icon={TrendingUp} />
                    </div>
                </div>

                {/* --- Right Column: Buy/Sell Panel --- */}
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Trade">
                        <div className="space-y-4">
                            <Metric 
                                label="Current Price" 
                                value={formatCurrency(currentPrice)} 
                                color="green"
                            />
                            <Metric 
                                label="Available Balance" 
                                value={formatCurrency(user?.walletBalance || 0)} 
                                color="purple"
                            />
                            <div className="pt-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Units to Buy</label>
                                <div className="flex space-x-2">
                                    <Button 
                                        variant="secondary" 
                                        onClick={() => setUnits(u => Math.max(1, u - 1))}
                                        icon={Minus}
                                        disabled={units <= 1}
                                    />
                                    <InputField
                                        type="number"
                                        value={units}
                                        onChange={(e) => setUnits(Math.max(1, parseInt(e.target.value) || 0))}
                                        min="1"
                                        step="1"
                                        required
                                        className="text-center"
                                    />
                                    <Button 
                                        variant="secondary" 
                                        onClick={() => setUnits(u => u + 1)}
                                        icon={Plus}
                                    />
                                </div>
                            </div>

                            <Metric 
                                label="Total Cost" 
                                value={formatCurrency(totalCost)} 
                                color={canBuy ? 'blue' : 'red'}
                            />
                            
                            <Button 
                                onClick={handleBuy} 
                                disabled={!canBuy || units === 0} 
                                variant="primary" 
                                icon={Zap}
                                className="w-full"
                            >
                                Confirm Purchase
                            </Button>
                            {!canBuy && <p className="text-xs text-red-500 mt-2 text-center">Insufficient funds!</p>}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};