const express     = require('express');
const dotenv      = require('dotenv');
const cors        = require('cors');
const path        = require('path');
const connectDB   = require('./config/db');
const authRoutes  = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const pizzaRoutes = require('./routes/pizzaRoutes'); // ✅ Added

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded images publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Test route
app.get('/', (req, res) => {
  res.json({ message: '🍕 OvenZa Crust API is running!' });
});

// Routes
app.use('/api/auth',   authRoutes);
app.use('/api/admin',  adminRoutes);
app.use('/api/pizzas', pizzaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
