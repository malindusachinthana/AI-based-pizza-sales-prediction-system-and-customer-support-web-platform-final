const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Admin    = require('../models/Admin');

// ─── REGISTER (Customers Only) ───────────────────────────────────────────────
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username already exists
    const existingUsername = await Customer.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    // Check if email already exists
    const existingEmail = await Customer.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash the password
    const hashed = await bcrypt.hash(password, 10);

    // Create new customer
    const customer = await Customer.create({
      username,
      email,
      password: hashed
    });

    res.status(201).json({
      message: '✅ Customer registered successfully!',
      id: customer._id
    });

  } catch (err) {
    res.status(500).json({ message: '❌ Server error: ' + err.message });
  }
};

