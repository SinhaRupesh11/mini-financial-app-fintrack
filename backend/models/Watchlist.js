const mongoose = require('mongoose');

const WatchlistSchema = new mongoose.Schema({
    // Reference to the User who owns this watchlist item
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to the 'User' model
        required: true,
    },
    // Reference to the Product being watched
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Refers to the 'Product' model
        required: true,
    },
    // Ensures a user can only add a specific product once
    dateAdded: {
        type: Date,
        default: Date.now,
    },
}, {
    // Add a compound unique index to prevent duplicate entries
    // A single user (userId) cannot have the same product (productId) twice
    indexes: [{ unique: true, fields: ['userId', 'productId'] }]
});

module.exports = mongoose.model('Watchlist', WatchlistSchema);
