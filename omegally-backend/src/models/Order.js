const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String,
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true, min: 0 },
    paymentType: { type: String, enum: ['full', 'installment'], required: true },
    installmentPlan: {
      months: Number,
      monthlyAmount: Number,
      totalInstallments: Number,
      paidInstallments: { type: Number, default: 0 },
      status: { type: String, enum: ['active', 'completed', 'defaulted'], default: 'active' },
    },
    delivery: {
      method: { type: String, enum: ['delivery', 'pickup'], required: true },
      address: String,
      pickupLocation: String,
      status: { type: String, enum: ['processing', 'shipped', 'delivered'], default: 'processing' },
      trackingNumber: String,
      estimatedDelivery: Date,
      deliveredAt: Date,
    },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending', index: true },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Order', orderSchema);