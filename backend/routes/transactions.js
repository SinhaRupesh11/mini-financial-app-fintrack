const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Product = require('../models/Product');

// @route   POST /api/transactions/buy
// @desc    Buy a product and update wallet balance atomically
// @access  Private
router.post('/buy', auth, async (req, res) => {
    // CRITICAL BACKEND FIX: Ensure units is treated as an integer, 
    // even if sent as a string from the frontend input field.
    let { productId, units } = req.body;
    units = parseInt(units); 

    if (!productId || typeof units !== 'number' || units <= 0 || isNaN(units)) {
        return res.status(400).json({ msg: 'Invalid product ID or units quantity.' });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        const cost = product.pricePerUnit * units;

        // 1. Check current balance before atomic update
        const user = await User.findById(req.user.id);
        if (!user) {
             return res.status(404).json({ msg: 'User session invalid.' });
        }
        if (user.walletBalance < cost) {
             return res.status(400).json({ msg: 'Insufficient wallet balance' });
        }

        // 2. Perform Atomic Update (Deduct balance safely)
        // This prevents race conditions and ensures immediate database update.
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { walletBalance: -cost } }, // Atomically deduct the cost
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(500).json({ msg: 'Could not update user balance.' });
        }
        
        // 3. Record Transaction
        const newTransaction = new Transaction({
            userId: req.user.id,
            productId,
            unitsPurchased: units,
            purchasePrice: product.pricePerUnit,
        });
        await newTransaction.save();

        // 4. Return the new wallet balance for the frontend to update context
        // This is crucial for stabilizing the Portfolio Dashboard.
        res.status(201).json({ 
            msg: 'Purchase successful',
            newWalletBalance: updatedUser.walletBalance
        });

    } catch (err) {
        console.error("Transaction Error:", err.message);
        res.status(500).send('Server Error during transaction processing.');
    }
});

module.exports = router;