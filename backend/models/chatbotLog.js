// ChatbotLog.js
const mongoose = require('mongoose');

const ChatbotLogSchema = new mongoose.Schema({
  questionType: { type: String, required: true }, 
  askedAt:      { type: Date,   default: Date.now },
});

module.exports = mongoose.model('ChatbotLog', ChatbotLogSchema);
