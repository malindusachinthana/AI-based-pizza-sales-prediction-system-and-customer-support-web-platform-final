// adminRoutes.js
// Place in: backend/routes/adminRoutes.js

const express  = require('express');
const router   = express.Router();
const Admin    = require('../models/admin');
const Customer = require('../models/Customer');
const Pizza    = require('../models/Pizza');
const Order    = require('../models/order');

// ── GET /api/admin/profile ─────────────────────────────────────
router.get('/profile', async (req, res) => {
  try {
    const adminId       = req.headers['admin-id'];
    const adminUsername = req.headers['admin-username'];

    let admin = null;

    if (adminId && adminId !== 'undefined' && adminId !== 'null') {
      admin = await Admin.findById(adminId).select('-password');
    }
    if (!admin && adminUsername) {
      admin = await Admin.findOne({ username: adminUsername }).select('-password');
    }

    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/admin/stats ───────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    // Total pizzas on menu
    const totalPizzas = await Pizza.countDocuments();

    // Total customers
    const totalCustomers = await Customer.countDocuments();

    // New customers registered today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const newToday = await Customer.countDocuments({
      createdAt: { $gte: startOfDay }
    });

    // Total orders
    const totalOrders = await Order.countDocuments();

    // Total revenue — sum of all order totals
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const revenue = revenueResult[0]?.total || 0;

    res.json({
      totalPizzas,
      totalCustomers,
      newToday,
      totalOrders,
      revenue,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
