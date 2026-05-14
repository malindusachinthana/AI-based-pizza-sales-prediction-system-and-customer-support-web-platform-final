const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
  badgeMain:   { type: String, default: 'BUY 1\nGET 1' },
  badgeSub:    { type: String, default: 'FREE\nOFFER..!' },
  pizzaName:   { type: String, required: true },
  description: { type: String, required: true },
  familyText:  { type: String, default: 'Enjoy\nWith\nYour\nWhole\nFamily.' },
  images:      [{ type: String }],   // up to 4 image paths
  isActive:    { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.models.Offer || mongoose.model('Offer', OfferSchema);
