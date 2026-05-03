const mongoose = require('mongoose');

const ChatbotConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,   // e.g. 'hours', 'contact', 'payment', 'how_to_order'
  },
  label: {
    type: String,   // e.g. 'Opening Hours'
    required: true,
  },
  answer: {
    type: String,   // The HTML answer string shown in the chatbot
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('ChatbotConfig', ChatbotConfigSchema);
