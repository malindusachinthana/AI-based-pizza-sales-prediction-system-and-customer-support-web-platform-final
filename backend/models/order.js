const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  pizzaId  : { type: String,  required: true },
  name     : { type: String,  required: true },
  size     : { type: String,  required: true, enum: ['small', 'medium', 'large'] },
  price    : { type: Number,  required: true },
  quantity : { type: Number,  required: true, min: 1 },
});

const OrderSchema = new mongoose.Schema({
  paypalOrderId : { type: String, required: true,},
  payerName     : { type: String, required: true },
  payerEmail    : { type: String, required: true },
  items         : [OrderItemSchema],
  total         : { type: Number, required: true },
  status        : { type: String, default: 'paid', enum: ['paid', 'pending', 'failed'] },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
