const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  panNumber: {
    type: String,
    required: true,
  },
  idImagePath: {
    type: String,
    required: true,
  },
  walletBalance: {
    type: Number,
    required: true,
    default: 100000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
