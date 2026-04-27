const express    = require('express');
const router     = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register  → Create new customer
router.post('/register', register);

