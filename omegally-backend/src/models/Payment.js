const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ['card', 'bank_transfer', 'ussd', 'pending'] },
    transactionId: { type: String, unique: true, sparse: true },
    status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending', index: true },
    installmentNumber: { type: Number, default: 0, min: 0 },
    paidAt: Date,
  },
  { timestamps: true }
);

paymentSchema.index({ orderId: 1, installmentNumber: 1 });

module.exports = mongoose.model('Payment', paymentSchema);