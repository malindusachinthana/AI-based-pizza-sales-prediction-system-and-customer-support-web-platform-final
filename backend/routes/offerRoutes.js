// offerRoutes.js
// Place in: backend/routes/offerRoutes.js

const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const Offer   = require('../models/Offer');

// ── Multer — accept up to 4 images ────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads/offers');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `offer_${Date.now()}_${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`);
  }
});
