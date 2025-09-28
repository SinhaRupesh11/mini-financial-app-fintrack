const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Watchlist = require('../models/Watchlist');

// @route   GET /api/watchlist
// @desc    Get user's watchlist items
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // Find all watchlist entries for the user and populate the associated product details.
        const watchlistItems = await Watchlist.find({ userId: req.user.id })
            // CRITICAL: Populate the product data linked by productId
            .populate('productId', 'name pricePerUnit category keyMetric') 
            .lean(); // Convert Mongoose documents to plain JS objects for clean manipulation

        // Reformat the output to match the desired frontend structure: [{ product: {...} }, ...]
        const formattedWatchlist = watchlistItems.map(item => ({
            product: item.productId, // This now holds the populated product object
            _id: item._id // Keep the watchlist item ID for easy deletion
        }));

        res.json(formattedWatchlist);

    } catch (err) {
        console.error("Watchlist Fetch Error:", err.message);
        res.status(500).send('Server Error retrieving watchlist data.');
    }
});

// @route   POST /api/watchlist
// @desc    Add a product to the watchlist
// @access  Private
router.post('/', auth, async (req, res) => {
    const { productId } = req.body;

    try {
        // Prevent duplicate entries
        const existing = await Watchlist.findOne({ userId: req.user.id, productId });
        if (existing) {
            return res.status(400).json({ msg: 'Product already in watchlist' });
        }

        const newWatchlistItem = new Watchlist({
            userId: req.user.id,
            productId
        });

        await newWatchlistItem.save();
        res.status(201).json({ msg: 'Product added to watchlist' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/watchlist/:productId
// @desc    Remove a product from the watchlist
// @access  Private
router.delete('/:productId', auth, async (req, res) => {
    try {
        // Find and remove the item based on both user ID and product ID
        const result = await Watchlist.findOneAndDelete({
            userId: req.user.id,
            productId: req.params.productId
        });

        if (!result) {
            return res.status(404).json({ msg: 'Watchlist item not found' });
        }

        res.json({ msg: 'Product removed from watchlist' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;