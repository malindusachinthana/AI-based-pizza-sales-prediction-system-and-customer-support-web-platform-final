// chatbotRoutes.js  (UPDATED)
// Place in: backend/routes/chatbotRoutes.js

const express       = require('express');
const router        = express.Router();
const Pizza         = require('../models/Pizza');
const Order         = require('../models/order');
const ChatbotConfig = require('../models/ChatbotConfig');
const ChatbotLog    = require('../models/ChatbotLog');

