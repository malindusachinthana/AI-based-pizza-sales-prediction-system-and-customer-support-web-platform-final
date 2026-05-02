const express = require('express');
const router  = express.Router();
const Order   = require('../models/order');  

router.post('/', async (req, res) => {
  try {
    const { paypalOrderId, payerName, payerEmail, items, total, status } = req.body;

    const order = new Order({
      paypalOrderId,
      payerName,
      payerEmail,
      items,
      total,
      status,
    });

    const saved = await order.save();
    res.status(201).json({ success: true, order: saved });

  } catch (err) {
    console.error('Order save error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

module.exports = router;