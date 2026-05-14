const mongoose = require('mongoose');

const ChatbotConfigSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  label: {
    type: String, 
    required: true,
  },
  answer: {
    type: String,  
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('ChatbotConfig', ChatbotConfigSchema);
