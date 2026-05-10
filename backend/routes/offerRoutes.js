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
const upload = multer({ storage });

// ── GET /api/offers ────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find({}).sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/offers/active ─────────────────────────────────────
router.get('/active', async (req, res) => {
  try {
    const offers = await Offer.find({
      $or: [{ isActive: true }, { isActive: 'true' }]
    }).sort({ createdAt: -1 });
    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/offers ───────────────────────────────────────────
router.post('/', upload.array('images', 4), async (req, res) => {
  try {
    const { badgeMain, badgeSub, pizzaName, description, familyText, isActive } = req.body;
    const images = (req.files || []).map(f => `/uploads/offers/${f.filename}`);

    const offer = await Offer.create({
      badgeMain:  badgeMain  || 'BUY 1\nGET 1',
      badgeSub:   badgeSub   || 'FREE\nOFFER..!',
      pizzaName,
      description,
      familyText: familyText || 'Enjoy\nWith\nYour\nWhole\nFamily.',
      images,
      isActive:   isActive !== 'false',
    });

    res.status(201).json({ message: '✅ Offer created!', offer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/offers/:id ────────────────────────────────────────
router.put('/:id', upload.array('images', 4), async (req, res) => {
  try {
    const { badgeMain, badgeSub, pizzaName, description, familyText, isActive, keepImages } = req.body;

    const updateData = {
      badgeMain, badgeSub, pizzaName, description, familyText,
      isActive: isActive !== 'false' && isActive !== false,
    };

    // If new images uploaded, replace; otherwise keep existing
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(f => `/uploads/offers/${f.filename}`);
    }

    const updated = await Offer.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Offer not found' });

    res.json({ message: '✅ Offer updated!', offer: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PATCH /api/offers/:id/toggle ──────────────────────────────
router.patch('/:id/toggle', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.status(404).json({ message: 'Offer not found' });
    offer.isActive = !offer.isActive;
    await offer.save();
    res.json({ message: '✅ Toggled!', isActive: offer.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
