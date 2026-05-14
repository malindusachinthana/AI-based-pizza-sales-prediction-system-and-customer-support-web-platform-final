const express       = require('express');
const router        = express.Router();
const Pizza         = require('../models/Pizza');
const Order         = require('../models/order');
const ChatbotConfig = require('../models/ChatbotConfig');
const ChatbotLog    = require('../models/ChatbotLog');

// Helper — get answer from DB config
async function getConfig(key, fallback) {
  try {
    const cfg = await ChatbotConfig.findOne({ key });
    return cfg?.answer || fallback;
  } catch { return fallback; }
}

// POST /api/chatbot/query
router.post('/query', async (req, res) => {
  const { type } = req.body;

  // Log this question for admin stats
  try { await ChatbotLog.create({ questionType: type }); } catch {}

  try {
    switch (type) {

      case 'best_seller': {
        const orders = await Order.find({});
        const count  = {};
        orders.forEach(order => {
          (order.items || []).forEach(item => {
            count[item.name] = (count[item.name] || 0) + (item.quantity || 1);
          });
        });
        const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
        if (!sorted.length)
          return res.json({ answer: "We don't have enough order data yet, but all our pizzas are amazing! 🍕" });
        const [name, qty] = sorted[0];
        return res.json({
          answer: `🏆 Our best selling pizza is <strong>${name}</strong> — ordered <strong>${qty}</strong> times! Customers absolutely love it.`
        });
      }

      case 'most_expensive': {
        const pizzas = await Pizza.find({});
        if (!pizzas.length) return res.json({ answer: 'No pizzas found in the menu right now.' });
        const top = pizzas.reduce((p, c) => (c.sizes?.large || 0) > (p.sizes?.large || 0) ? c : p);
        return res.json({
          answer: `💎 The most expensive pizza is <strong>${top.name}</strong> — Large size at <strong>Rs. ${top.sizes?.large?.toLocaleString()}</strong>.`
        });
      }

      case 'cheapest': {
        const pizzas = await Pizza.find({});
        if (!pizzas.length) return res.json({ answer: 'No pizzas found in the menu right now.' });
        const cheapest = pizzas.reduce((p, c) => (c.sizes?.small || Infinity) < (p.sizes?.small || Infinity) ? c : p);
        return res.json({
          answer: `💚 Our most affordable pizza is <strong>${cheapest.name}</strong> — Small size starts at just <strong>Rs. ${cheapest.sizes?.small?.toLocaleString()}</strong>!`
        });
      }

      case 'veggie': {
        const pizzas = await Pizza.find({ category: 'Veggie' });
        if (!pizzas.length) return res.json({ answer: "We don't have dedicated veggie pizzas listed yet. Check our Menu!" });
        return res.json({
          answer: `🥦 Yes! We have <strong>${pizzas.length}</strong> vegetarian pizzas: <strong>${pizzas.map(p => p.name).join(', ')}</strong>. All available in Small, Medium & Large!`
        });
      }

      case 'chicken': {
        const pizzas = await Pizza.find({ category: 'Chicken' });
        if (!pizzas.length) return res.json({ answer: 'No chicken pizzas found right now. Check back soon!' });
        return res.json({
          answer: `🍗 We have <strong>${pizzas.length}</strong> Chicken pizzas: <strong>${pizzas.map(p => p.name).join(', ')}</strong>. All juicy and delicious!`
        });
      }

      case 'classic': {
        const pizzas = await Pizza.find({ category: 'Classic' });
        if (!pizzas.length) return res.json({ answer: 'No classic pizzas found right now.' });
        return res.json({
          answer: `🍕 Our Classic pizzas: <strong>${pizzas.map(p => p.name).join(', ')}</strong>. Timeless favourites made with love!`
        });
      }

      case 'supreme': {
        const pizzas = await Pizza.find({ category: 'Supreme' });
        if (!pizzas.length) return res.json({ answer: 'No supreme pizzas found right now.' });
        return res.json({
          answer: `👑 Our Supreme pizzas: <strong>${pizzas.map(p => p.name).join(', ')}</strong>. Loaded with premium toppings!`
        });
      }

      case 'total_pizzas': {
        const count = await Pizza.countDocuments();
        return res.json({
          answer: `🍕 We currently have <strong>${count} pizzas</strong> on our menu across 4 categories — Classic, Chicken, Supreme, and Veggie. Head to the Menu to explore them all!`
        });
      }

      // Editable answers from MongoDB config
      case 'hours': {
        const answer = await getConfig('hours',
          `🕐 We're open every day:<br/><strong>Mon – Fri:</strong> 10:00 AM – 11:00 PM<br/><strong>Sat – Sun:</strong> 9:00 AM – 12:00 AM`
        );
        return res.json({ answer });
      }

      case 'how_to_order': {
        const answer = await getConfig('how_to_order',
          `🛒 Go to Menu → Choose pizza & size → Add to cart → Checkout → Confirmed! ✅`
        );
        return res.json({ answer });
      }

      case 'payment': {
        const answer = await getConfig('payment',
          `💳 We currently accept <strong>PayPal</strong> for secure online payments.`
        );
        return res.json({ answer });
      }

      case 'contact': {
        const answer = await getConfig('contact',
          `📍 <strong>OvenZa Crust, Colombo, Sri Lanka</strong>.<br/>📞 <strong>+94 11 234 5678</strong>`
        );
        return res.json({ answer });
      }

      default: {
        // Try to find answer in custom DB configs
        try {
          const customCfg = await ChatbotConfig.findOne({ key: type });
          if (customCfg) {
            return res.json({ answer: customCfg.answer });
          }
        } catch {}
        return res.json({ answer: "I'm not sure about that! Try one of the questions below 👇" });
      }
    }

  } catch (err) {
    console.error('Chatbot error:', err);
    res.status(500).json({ answer: 'Something went wrong. Please try again!' });
  }
});

module.exports = router;
