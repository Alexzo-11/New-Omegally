const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Product = require('../models/Product');
const generateOrderNumber = require('../utils/generateOrderNumber');

exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items, deliveryMethod, address, pickupLocation, paymentType, installmentMonths } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }
    if (!deliveryMethod) return res.status(400).json({ message: 'Delivery method required' });
    if (deliveryMethod === 'delivery' && !address) {
      return res.status(400).json({ message: 'Address required for delivery' });
    }
    if (deliveryMethod === 'pickup' && !pickupLocation) {
      return res.status(400).json({ message: 'Pickup location required' });
    }
    if (paymentType === 'installment' && (!installmentMonths || ![3, 6, 12].includes(installmentMonths))) {
      return res.status(400).json({ message: 'Valid installment months (3,6,12) required' });
    }

    // Fetch products and validate stock
    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true });
    if (products.length !== items.length) {
      return res.status(400).json({ message: 'One or more products not found' });
    }

    let totalAmount = 0;
    const orderItems = [];
    for (const item of items) {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) return res.status(400).json({ message: `Product not found: ${item.productId}` });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
      orderItems.push({
        productId: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Installment plan
    let installmentPlan = {};
    if (paymentType === 'full') {
      installmentPlan = {
        months: null,
        monthlyAmount: totalAmount,
        totalInstallments: 1,
        paidInstallments: 0,
        status: 'active',
      };
    } else {
      const monthlyAmount = totalAmount / installmentMonths;
      installmentPlan = {
        months: installmentMonths,
        monthlyAmount,
        totalInstallments: installmentMonths,
        paidInstallments: 0,
        status: 'active',
      };
    }

    // Create order
    const order = await Order.create({
      userId,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      totalAmount,
      paymentType,
      installmentPlan,
      delivery: {
        method: deliveryMethod,
        address: deliveryMethod === 'delivery' ? address : undefined,
        pickupLocation: deliveryMethod === 'pickup' ? pickupLocation : undefined,
      },
      status: 'pending',
    });

    // Create first payment record
    const firstPaymentAmount = paymentType === 'full' ? totalAmount : installmentPlan.monthlyAmount;
    const firstPaymentInstallment = paymentType === 'full' ? 0 : 1;

    const payment = await Payment.create({
      orderId: order._id,
      userId,
      amount: firstPaymentAmount,
      paymentMethod: 'pending',
      transactionId: null,
      status: 'pending',
      installmentNumber: firstPaymentInstallment,
    });

    res.status(201).json({
      status: 'success',
      data: { order, payment: { id: payment._id, amount: payment.amount, installmentNumber: payment.installmentNumber } },
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort('-createdAt');
    res.status(200).json({ status: 'success', data: orders });
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    res.status(200).json({ status: 'success', data: order });
  } catch (err) {
    next(err);
  }
};

exports.getOrderPayments = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const payments = await Payment.find({ orderId: order._id }).sort('installmentNumber');
    res.status(200).json({ status: 'success', data: payments });
  } catch (err) {
    next(err);
  }
};