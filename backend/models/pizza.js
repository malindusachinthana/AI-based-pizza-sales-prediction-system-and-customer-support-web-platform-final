const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
  name: {
    type:     String,
    required: true,
    trim:     true,
    unique:   true
  },
  category: {
    type:     String,
    required: true,
    enum:     ['Classic', 'Chicken', 'Supreme', 'Veggie']
  },
  description: {
    type:    String,
    default: ''
  },
  sizes: {
    small:  { type: Number, required: true },
    medium: { type: Number, required: true },
    large:  { type: Number, required: true }
  },
  imageUrl: {
    type:     String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Pizza', pizzaSchema);