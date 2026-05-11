const Customer    = require('../models/Customer');
const Admin       = require('../models/Admin');
const bcrypt      = require('bcryptjs');
const jwt         = require('jsonwebtoken');

// Register
const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await Customer.findOne({ $or: [{ username }, { email }] });
    if (existing) return res.status(400).json({ message: 'Username or email already exists' });

    const hashed  = await bcrypt.hash(password, 10);
    const customer = new Customer({ username, email, password: hashed });
    await customer.save();
    res.status(201).json({ message: 'Customer registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check admin first
    const admin = await Admin.findOne({ username });
    if (admin) {
      const match = await bcrypt.compare(password, admin.password);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });
      const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
      return res.json({ token, role: 'admin', username: admin.username });
    }

    // Check customer
    const customer = await Customer.findOne({ username });
    if (!customer) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, customer.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: customer._id, role: 'customer' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return res.json({ token, role: 'customer', username: customer.username });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Profile (email + password)
const updateProfile = async (req, res) => {
  const { username, newEmail, currentPassword, newPassword } = req.body;
  try {
    const customer = await Customer.findOne({ username });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    // Always verify current password before any change
    const match = await bcrypt.compare(currentPassword, customer.password);
    if (!match) return res.status(401).json({ message: 'Current password is incorrect' });

    // Update email if provided
    if (newEmail && newEmail !== customer.email) {
      const emailTaken = await Customer.findOne({ email: newEmail });
      if (emailTaken) return res.status(400).json({ message: 'Email already in use' });
      customer.email = newEmail;
    }

    // Update password if provided
    if (newPassword) {
      if (newPassword.length < 6)
        return res.status(400).json({ message: 'New password must be at least 6 characters' });
      customer.password = await bcrypt.hash(newPassword, 10);
    }

    await customer.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { register, login, updateProfile };
