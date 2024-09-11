// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000; // Use the PORT environment variable

// Middleware
app.use(cors());
app.use(express.json()); // Built-in body-parser middleware for parsing JSON

// Connect to MongoDB with improved error handling
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => {
  console.error('MongoDB connection error:', err.message); // Detailed error logging
  process.exit(1); // Optional: exit the app if DB connection fails
});

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true }, // Stock Quantity
  description: { type: String },
  images: [{ type: String }], // Array of image URLs
  category: { type: String, required: true }, // Category of the product
});

const Product = mongoose.model('Product', productSchema);

// Routes
// Create a new product
app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single product by ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a product by ID
app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product by ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
