// chatbotConfigRoutes.js
const express       = require('express');
const router        = express.Router();
const ChatbotConfig = require('../models/ChatbotConfig');
const ChatbotLog    = require('../models/ChatbotLog');
const Pizza         = require('../models/Pizza');
const Order         = require('../models/order');

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

// GET /api/chatbot-config — get all
router.get('/', async (req, res) => {
  try {
    const configs = await ChatbotConfig.find({}).sort({ createdAt: 1 });
    res.json(configs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/chatbot-config — add new custom Q&A
router.post('/', async (req, res) => {
  try {
    const { label, answer } = req.body;
    if (!label || !answer)
      return res.status(400).json({ message: 'Label and answer are required' });

    // Generate unique key from label
    const key = label
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .slice(0, 30) + '_' + Date.now();

    const config = await ChatbotConfig.create({ key, label, answer });
    res.status(201).json({ message: '✅ Question added!', config });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/chatbot-config/:key — update label AND/OR answer
router.put('/:key', async (req, res) => {
  try {
    const { label, answer } = req.body;
    const updateData = { updatedAt: new Date() };
    if (answer !== undefined) updateData.answer = answer;
    if (label  !== undefined) updateData.label  = label;

    const updated = await ChatbotConfig.findOneAndUpdate(
      { key: req.params.key },
      updateData,
      { returnDocument: 'after' }
    );
    if (!updated) return res.status(404).json({ message: 'Config not found' });
    res.json({ message: '✅ Updated!', config: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/chatbot-config/:key — delete custom Q&A
router.delete('/:key', async (req, res) => {
  try {
    // Protect default keys
    const PROTECTED = ['hours', 'how_to_order', 'payment', 'contact'];
    if (PROTECTED.includes(req.params.key))
      return res.status(403).json({ message: 'Cannot delete default questions' });

    const deleted = await ChatbotConfig.findOneAndDelete({ key: req.params.key });
    if (!deleted) return res.status(404).json({ message: 'Config not found' });
    res.json({ message: '✅ Deleted!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
