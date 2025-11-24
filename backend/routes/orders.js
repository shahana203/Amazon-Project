const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const authMiddleware = require('../controllers/userController'); // protect all routes

router.use(authMiddleware);

// Place a new order
router.post('/', async (req, res) => {
  const { address, payment } = req.body;
  try {
    // Get the user's cart
    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    if (!cart || !cart.items.length) return res.status(400).json({ error: 'Cart is empty.' });

    // Create order with cart items
    const order = new Order({
      user: req.userId,
      address,
      payment,
      items: cart.items.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      })),
      subtotal: cart.items.reduce((sum, item) => sum + (item.product.priceCents * item.quantity), 0),
      status: 'Pending'
    });
    await order.save();

    // Clear user's cart
    cart.items = [];
    await cart.save();

    res.json({ message: "Order placed!", order });
  } catch (err) {
    res.status(500).json({ error: 'Order creation failed.' });
  }
});

// Get all orders of logged-in user
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders.' });
  }
});

module.exports = router;
