const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const router   = express.Router(); // ✅ This was missing!
const Pizza    = require('../models/Pizza');
const { protect, adminOnly } = require('../middleware/authMiddleware');

