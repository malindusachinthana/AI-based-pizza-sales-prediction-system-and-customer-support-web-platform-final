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
    const TZ_OFFSET_MS = 5.5 * 60 * 60 * 1000;
    const nowUTC       = new Date();
    const nowLocal     = new Date(nowUTC.getTime() + TZ_OFFSET_MS);

    // ── Start of today (local) → UTC ──────────────────────────
    const startOfTodayLocal = new Date(nowLocal);
    startOfTodayLocal.setUTCHours(0, 0, 0, 0);
    const startOfTodayUTC = new Date(startOfTodayLocal.getTime() - TZ_OFFSET_MS);

    // ── Start of this week Monday (local) → UTC ───────────────
    const localDay      = nowLocal.getUTCDay();
    const diffToMon     = localDay === 0 ? -6 : 1 - localDay;
    const mondayLocal   = new Date(nowLocal);
    mondayLocal.setUTCDate(nowLocal.getUTCDate() + diffToMon);
    mondayLocal.setUTCHours(0, 0, 0, 0);
    const mondayUTC     = new Date(mondayLocal.getTime() - TZ_OFFSET_MS);

    // ── Start of last week Monday (local) → UTC ───────────────
    const lastMondayLocal = new Date(mondayLocal);
    lastMondayLocal.setUTCDate(mondayLocal.getUTCDate() - 7);
    const lastMondayUTC   = new Date(lastMondayLocal.getTime() - TZ_OFFSET_MS);

    // ── Total pizzas ───────────────────────────────────────────
    const totalPizzas = await Pizza.countDocuments();

    // ── Pizzas added this week ─────────────────────────────────
    const pizzasThisWeek = await Pizza.countDocuments({
      createdAt: { $gte: mondayUTC }
    });

    // ── Total customers ────────────────────────────────────────
    const totalCustomers = await Customer.countDocuments();

    // ── New customers today ────────────────────────────────────
    const newToday = await Customer.countDocuments({
      createdAt: { $gte: startOfTodayUTC }
    });

    // ── Total orders ───────────────────────────────────────────
    const totalOrders = await Order.countDocuments();

    // ── Orders placed today ────────────────────────────────────
    const ordersToday = await Order.countDocuments({
      createdAt: { $gte: startOfTodayUTC }
    });

    // ── Total revenue ──────────────────────────────────────────
    const revenueResult = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const revenue = revenueResult[0]?.total || 0;

    // ── Revenue this week ──────────────────────────────────────
    const thisWeekRevResult = await Order.aggregate([
      { $match: { createdAt: { $gte: mondayUTC } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const revenueThisWeek = thisWeekRevResult[0]?.total || 0;

    // ── Revenue last week ──────────────────────────────────────
    const lastWeekRevResult = await Order.aggregate([
      { $match: { createdAt: { $gte: lastMondayUTC, $lt: mondayUTC } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    const revenueLastWeek = lastWeekRevResult[0]?.total || 0;

    // ── Revenue % change week over week ───────────────────────
    let revenueChange = 0;
    if (revenueLastWeek > 0) {
      revenueChange = Math.round(((revenueThisWeek - revenueLastWeek) / revenueLastWeek) * 100);
    } else if (revenueThisWeek > 0) {
      revenueChange = 100; // First week with sales
    }

    res.json({
      totalPizzas,
      pizzasThisWeek,
      totalCustomers,
      newToday,
      totalOrders,
      ordersToday,
      revenue,
      revenueThisWeek,
      revenueChange,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
