const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/Product');

// Dummy historical data for charting
const generateHistoricalData = () => {
  const data = [];
  const startPrice = Math.random() * 200 + 100; // Random starting price
  let currentPrice = startPrice;

  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    
    // Add random daily fluctuation
    currentPrice += (Math.random() - 0.5) * 10;
    if (currentPrice < 50) currentPrice = 50; // Keep price from dropping too low

    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(currentPrice.toFixed(2)),
    });
  }
  return data;
};

//    GET /api/products
//     Get all products
//   Private
router.get('/', auth, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//   GET /api/products/:id
//  Get a single product with dummy details
//   Private
router.get('/:id', auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        
        // Add dummy data for a more detailed view and charting
        const productDetails = {
            ...product.toObject(),
            description: "This is a dummy description for the product. It is a simplified representation of a financial asset for educational purposes. Performance is based on a random walk algorithm to simulate market fluctuations.",
            historicalData: generateHistoricalData(),
            marketCap: Math.floor(Math.random() * 1000000) * 1000,
            volume: Math.floor(Math.random() * 100000),
        };
        
        res.json(productDetails);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
