const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// @route   GET /api/portfolio
// @desc    Get user portfolio summary and holdings
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Step 1: Aggregate transactions for the logged-in user
        const holdings = await Transaction.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(req.user.id)
                }
            },
            {
                $group: {
                    _id: "$productId",
                    totalUnits: { $sum: "$unitsPurchased" },
                    totalInvested: { $sum: { $multiply: ["$unitsPurchased", "$purchasePrice"] } }
                }
            },
            {
                // Step 2: Join with the Products collection to get current price
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $unwind: '$productDetails' // Deconstruct the productDetails array
            },
            {
                // Step 3: Calculate current value based on current price
                $project: {
                    _id: 0,
                    product: {
                        _id: "$productDetails._id",
                        name: "$productDetails.name",
                        category: "$productDetails.category",
                        pricePerUnit: "$productDetails.pricePerUnit",
                    },
                    units: "$totalUnits",
                    totalInvested: "$totalInvested",
                    currentValue: { $multiply: ["$totalUnits", "$productDetails.pricePerUnit"] }
                }
            }
        ]);

        // Calculate overall portfolio metrics
        const totalInvested = holdings.reduce((acc, item) => acc + item.totalInvested, 0);
        const currentValue = holdings.reduce((acc, item) => acc + item.currentValue, 0);

        res.json({
            totalInvested,
            currentValue,
            returns: currentValue - totalInvested,
            holdings: holdings
        });

    } catch (err) {
        console.error("Portfolio Error:", err.message);
        res.status(500).send('Server Error retrieving portfolio data.');
    }
});

module.exports = router;