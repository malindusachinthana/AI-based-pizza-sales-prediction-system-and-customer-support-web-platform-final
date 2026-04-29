const express = require('express');
const router  = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Customer = require('../models/Customer');

// GET /api/admin/stats → Get dashboard stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const newToday = await Customer.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    res.json({
      totalCustomers,
      newToday,
      totalPizzas:  24,   // ← will be dynamic when menu is built
      totalOrders:  389,  // ← will be dynamic when orders are built
      revenue:      84000 // ← will be dynamic when orders are built
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;