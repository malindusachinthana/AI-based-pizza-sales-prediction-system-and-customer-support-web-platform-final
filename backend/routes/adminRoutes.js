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


// ── GET /api/admin/weekly-sales ───────────────────────────────
router.get('/weekly-sales', async (req, res) => {
  try {
    // Sri Lanka timezone offset: UTC+5:30 = +330 minutes = +19800 seconds
    const TZ_OFFSET_MS = 5.5 * 60 * 60 * 1000;

    // Get current local time in Sri Lanka
    const nowUTC   = new Date();
    const nowLocal = new Date(nowUTC.getTime() + TZ_OFFSET_MS);

    // Find Monday of current local week
    const localDay  = nowLocal.getUTCDay(); // 0=Sun
    const diffToMon = (localDay === 0) ? -6 : 1 - localDay;

    const mondayLocal = new Date(nowLocal);
    mondayLocal.setUTCDate(nowLocal.getUTCDate() + diffToMon);
    mondayLocal.setUTCHours(0, 0, 0, 0);

    const sundayLocal = new Date(mondayLocal);
    sundayLocal.setUTCDate(mondayLocal.getUTCDate() + 6);
    sundayLocal.setUTCHours(23, 59, 59, 999);

    // Convert back to UTC for MongoDB query
    const mondayUTC = new Date(mondayLocal.getTime() - TZ_OFFSET_MS);
    const sundayUTC = new Date(sundayLocal.getTime() - TZ_OFFSET_MS);

    // Aggregate — shift createdAt by +5:30 before extracting day
    const results = await Order.aggregate([
      {
        $match: { createdAt: { $gte: mondayUTC, $lte: sundayUTC } }
      },
      {
        $addFields: {
          // Shift timestamp to Sri Lanka local time before grouping
          localDate: {
            $toDate: { $add: ['$createdAt', TZ_OFFSET_MS] }
          }
        }
      },
      {
        $group: {
          _id:    { $dayOfWeek: '$localDate' }, // 1=Sun,2=Mon,...7=Sat (local)
          total:  { $sum: '$total' },
          orders: { $sum: 1 }
        }
      }
    ]);

    // Map Mon–Sun
    const days = [
      { day: 'Mon', dow: 2 },
      { day: 'Tue', dow: 3 },
      { day: 'Wed', dow: 4 },
      { day: 'Thu', dow: 5 },
      { day: 'Fri', dow: 6 },
      { day: 'Sat', dow: 7 },
      { day: 'Sun', dow: 1 },
    ];

    // Today's local day-of-week in MongoDB format
    const todayDow = nowLocal.getUTCDay() === 0 ? 1 : nowLocal.getUTCDay() + 1;

    const weekly = days.map(({ day, dow }) => {
      const found = results.find(r => r._id === dow);
      return {
        day,
        total:   found?.total  || 0,
        orders:  found?.orders || 0,
        isToday: dow === todayDow,
      };
    });

    res.json(weekly);
  } catch (err) {
    console.error('Weekly sales error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
