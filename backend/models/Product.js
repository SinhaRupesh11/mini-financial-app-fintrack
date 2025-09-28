const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  keyMetric: {
    type: Number, // This could be P/E Ratio, Expense Ratio, etc.
    required: false,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
