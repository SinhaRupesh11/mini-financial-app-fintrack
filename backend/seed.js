const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product'); 

dotenv.config();

const products = [
  {
    name: "Tech Innovators ETF",
    category: "ETF",
    pricePerUnit: 250,
    keyMetric: 32.5,
  },
  {
    name: "Global Health Fund",
    category: "Mutual Fund",
    pricePerUnit: 125,
    keyMetric: 1.25,
  },
  {
    name: "Sustainable Energy Corp.",
    category: "Stock",
    pricePerUnit: 520,
    keyMetric: 45.1,
  },
  {
    name: "Blue-Chip Holdings",
    category: "Mutual Fund",
    pricePerUnit: 350,
    keyMetric: 1.1,
  },
  {
    name: "AI & Robotics",
    category: "ETF",
    pricePerUnit: 480,
    keyMetric: 55.7,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected for seeding.');

    await Product.deleteMany({});
    console.log('Existing products removed.');

    await Product.insertMany(products);
    console.log('Products seeded successfully!');
    
    mongoose.connection.close();
    console.log('MongoDB connection closed.');

  } catch (err) {
    console.error(`Error during seeding: ${err.message}`);
    process.exit(1);
  }
};

seedDB();
