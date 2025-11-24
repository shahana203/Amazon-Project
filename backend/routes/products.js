const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const authMiddleware = require('../controllers/userController')

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch(err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) 
      return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch(err) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});


// Add review to a product


// Assume you've attached req.userId via your auth middleware.

router.post('/:id/reviews', authMiddleware, async (req, res) => {
  const { rating, comment } = req.body;
  // req.userId is set by your auth middleware (from JWT)
  const user = req.userId; // Or fetch the username/email using userId

  if (!user || !rating || !comment) {
    return res.status(400).json({ error: "All fields required" });
  }
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    product.reviews.push({ user, rating, comment });
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Could not add review" });
  }
});


module.exports = router;
