const express  = require('express');
const multer   = require('multer');
const path     = require('path');
const fs       = require('fs');
const router   = express.Router(); // ✅ This was missing!
const Pizza    = require('../models/Pizza');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ── Multer Configuration ──────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/pizzas/');
  },
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${cleanName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    if (ext) cb(null, true);
    else cb(new Error('Only image files are allowed!'));
  }
});

// ── GET ALL PIZZAS (public) ───────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const pizzas = await Pizza.find().sort({ category: 1, name: 1 });
    res.json(pizzas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET BY CATEGORY (public) ──────────────────────────────────
router.get('/category/:category', async (req, res) => {
  try {
    const pizzas = await Pizza.find({ category: req.params.category });
    res.json(pizzas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADD NEW PIZZA (admin only) ────────────────────────────────
router.post('/', protect, adminOnly, upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, smallPrice, mediumPrice, largePrice } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const imageUrl = `/uploads/pizzas/${req.file.filename}`;

    const pizza = await Pizza.create({
      name,
      category,
      description,
      sizes: {
        small:  Number(smallPrice),
        medium: Number(mediumPrice),
        large:  Number(largePrice)
      },
      imageUrl
    });

    res.status(201).json({ message: '✅ Pizza added successfully!', pizza });

  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: err.message });
  }
});

// ── DELETE PIZZA (admin only) ─────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);

    if (!pizza) {
      return res.status(404).json({ message: 'Pizza not found' });
    }

    // Delete image file from server
    const imagePath = path.join(__dirname, '..', pizza.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // Delete from MongoDB
    await Pizza.findByIdAndDelete(req.params.id);

    res.json({ message: '✅ Pizza deleted successfully!' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;