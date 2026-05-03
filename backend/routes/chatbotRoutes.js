// chatbotRoutes.js  (UPDATED)
// Place in: backend/routes/chatbotRoutes.js

const express       = require('express');
const router        = express.Router();
const Pizza         = require('../models/Pizza');
const Order         = require('../models/order');
const ChatbotConfig = require('../models/ChatbotConfig');
const ChatbotLog    = require('../models/ChatbotLog');

// Helper — get answer from DB config (falls back to hardcoded)
async function getConfig(key, fallback) {
  try {
    const cfg = await ChatbotConfig.findOne({ key });
    return cfg?.answer || fallback;
  } catch { return fallback; }
}

