const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const authMiddleware = require('../controllers/userController');

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    res.json(cart || { user: req.userId, items: [] });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get cart' });
  }
});

// Add/Update item
router.post('/add', async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) return res.status(400).json({ error: 'No productId sent' });
  if (!quantity || quantity <= 0) return res.status(400).json({ error: 'Quantity must be positive' });

  try {
    const productExists = await Product.exists({ _id: productId });
    if (!productExists) return res.status(404).json({ error: 'Product not found' });

    let cart = await Cart.findOne({ user: req.userId });
    if (!cart) cart = new Cart({ user: req.userId, items: [] });

    const index = cart.items.findIndex(item => item.product.equals(productId));
    if (index > -1) {
      cart.items[index].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// Quantity update
router.post('/update', async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) return res.status(400).json({ error: 'No productId sent' });
  if (!quantity || quantity <= 0) return res.status(400).json({ error: 'Quantity must be positive' });
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const index = cart.items.findIndex(item => item.product.equals(productId));
    if (index > -1) {
      cart.items[index].quantity = quantity;
      await cart.save();
      await cart.populate('items.product');
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

// Remove item
router.post('/remove', async (req, res) => {
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: 'No productId sent' });
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    cart.items = cart.items.filter(item => !item.product.equals(productId));
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
});

module.exports = router;
