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
