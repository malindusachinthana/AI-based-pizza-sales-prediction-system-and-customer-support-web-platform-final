const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const dotenv   = require('dotenv');
const Admin    = require('./models/Admin');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existing = await Admin.findOne({ username: 'OvZa_Admin@2025' });
    if (existing) {
      console.log('⚠️ Admin already exists!');
      process.exit();
    }

    // Hash password
    const hashed = await bcrypt.hash('Ov3nZ@Cru$t!2025#', 10);

    // Create the admin
    await Admin.create({
      username: 'OvZa_Admin@2025',
      email:    'admin@ovenZacrust.com',
      password: hashed,
      role:     'admin'
    });

    console.log('✅ Admin account created successfully!');
    console.log('👤 Username: OvZa_Admin@2025');
    console.log('🔑 Password: Ov3nZ@Cru$t!2025#');
    process.exit();

  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
};

createAdmin();