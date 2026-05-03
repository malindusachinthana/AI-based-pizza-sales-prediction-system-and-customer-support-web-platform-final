const express        = require('express');
const router         = express.Router();
const ChatbotConfig  = require('../models/ChatbotConfig');
const ChatbotLog     = require('../models/ChatbotLog');
const Pizza          = require('../models/Pizza');
const Order          = require('../models/order');

const DEFAULTS = [
  {
    key:    'hours',
    label:  'Opening Hours',
    answer: `🕐 We're open every day:<br/><strong>Mon – Fri:</strong> 10:00 AM – 11:00 PM<br/><strong>Sat – Sun:</strong> 9:00 AM – 12:00 AM (Midnight)`,
  },
  {
    key:    'how_to_order',
    label:  'How to Order',
    answer: `🛒 Ordering is easy!<br/>1. Go to the <strong>Menu</strong> page<br/>2. Choose your pizza & size<br/>3. Add to cart 🛒<br/>4. Checkout with <strong>PayPal</strong><br/>5. Your order is confirmed instantly! ✅`,
  },
  {
    key:    'payment',
    label:  'Payment Methods',
    answer: `💳 We currently accept <strong>PayPal</strong> for secure online payments. More payment options coming soon!`,
  },
  {
    key:    'contact',
    label:  'Location & Contact',
    answer: `📍 Find us at <strong>OvenZa Crust, Colombo, Sri Lanka</strong>.<br/>📞 Call us: <strong>+94 11 234 5678</strong><br/>📧 Email: <strong>hello@ovenzacrust.lk</strong>`,
  },
];

// ══ Named routes MUST come before /:key ══

// GET /api/chatbot-config/seed
router.get('/seed', async (req, res) => {
  try {
    for (const d of DEFAULTS) {
      await ChatbotConfig.findOneAndUpdate(
        { key: d.key },
        { $setOnInsert: d },
        { upsert: true, returnDocument: 'after' }
      );
    }
    const all = await ChatbotConfig.find({});
    res.json({ message: '✅ Defaults seeded.', count: all.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/chatbot-config/stats
router.get('/stats', async (req, res) => {
  try {
    const logs = await ChatbotLog.aggregate([
      { $group: { _id: '$questionType', count: { $sum: 1 } } },
      { $sort:  { count: -1 } },
      { $limit: 10 }
    ]);
    const total = await ChatbotLog.countDocuments();
    res.json({ logs, total });
  } catch (err) {
    res.json({ logs: [], total: 0 });
  }
});

// GET /api/chatbot-config/live-preview
router.get('/live-preview', async (req, res) => {
  try {
    const pizzas = await Pizza.find({});
    const orders = await Order.find({});

    const countMap = {};
    orders.forEach(o => {
      (o.items || []).forEach(item => {
        if (item.name) countMap[item.name] = (countMap[item.name] || 0) + (item.quantity || 1);
      });
    });
    const sorted     = Object.entries(countMap).sort((a, b) => b[1] - a[1]);
    const bestSeller = sorted.length > 0
      ? { name: sorted[0][0], orders: sorted[0][1] }
      : { name: 'No orders yet', orders: 0 };

    let mostExpensive = { name: 'N/A', price: 0 };
    if (pizzas.length > 0) {
      const exp = pizzas.reduce((p, c) => (c.sizes?.large || 0) > (p.sizes?.large || 0) ? c : p);
      mostExpensive = { name: exp.name, price: exp.sizes?.large || 0 };
    }

    let cheapest = { name: 'N/A', price: 0 };
    if (pizzas.length > 0) {
      const cheap = pizzas.reduce((p, c) => (c.sizes?.small || Infinity) < (p.sizes?.small || Infinity) ? c : p);
      cheapest = { name: cheap.name, price: cheap.sizes?.small || 0 };
    }

    res.json({ totalPizzas: pizzas.length, bestSeller, mostExpensive, cheapest });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
