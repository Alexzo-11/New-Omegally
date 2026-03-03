const Payment = require('../models/Payment');
const Order = require('../models/Order');
const paypal = require('../utils/paypal');
const axios = require('axios');

exports.processPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const { paymentMethod } = req.body;

    if (!paymentMethod) return res.status(400).json({ message: 'Payment method required' });

    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    if (payment.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Access denied' });
    if (payment.status !== 'pending') return res.status(400).json({ message: 'Payment already processed' });

    // Simulate gateway success
    const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    payment.status = 'success';
    payment.paymentMethod = paymentMethod;
    payment.transactionId = transactionId;
    payment.paidAt = new Date();
    await payment.save();

    const order = await Order.findById(payment.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    if (order.status === 'pending') order.status = 'confirmed';

    if (order.paymentType === 'installment') {
      order.installmentPlan.paidInstallments += 1;
      if (order.installmentPlan.paidInstallments === order.installmentPlan.totalInstallments) {
        order.installmentPlan.status = 'completed';
        order.status = 'completed';
      }
    } else {
      order.installmentPlan.paidInstallments = 1;
      order.installmentPlan.status = 'completed';
      order.status = 'completed';
    }

    await order.save();

    res.status(200).json({ status: 'success', data: { payment, order } });
  } catch (err) {
    next(err);
  }
};




// 1. Initiate PayPal payment
exports.initiatePayPalPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: payment.amount.toFixed(2)
        },
        custom_id: payment.orderId.toString()
      }],
      application_context: {
        brand_name: 'Omegally',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL}/payment/success?gateway=paypal`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
      }
    });

    const paypalOrder = await paypal.client().execute(request);
    payment.transactionId = paypalOrder.result.id;
    await payment.save();

    const approvalUrl = paypalOrder.result.links.find(link => link.rel === 'approve').href;
    res.json({ status: 'success', data: { approvalUrl, paypalOrderId: paypalOrder.result.id } });
  } catch (err) {
    next(err);
  }
};

// 2. Capture PayPal payment (after user returns)
exports.capturePayPalPayment = async (req, res, next) => {
  try {
    const { paypalOrderId } = req.body;
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({});
    const capture = await paypal.client().execute(request);

    const payment = await Payment.findOne({ transactionId: paypalOrderId });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    payment.status = 'success';
    payment.paymentMethod = 'paypal';
    payment.transactionId = capture.result.id;
    payment.paidAt = new Date();
    await payment.save();

    // Update order status (same helper as before)
    await updateOrderAfterPayment(payment.orderId, payment.installmentNumber);

    res.json({ status: 'success', message: 'Payment captured' });
  } catch (err) {
    next(err);
  }
};
// Webhook for external payment gateway
exports.paymentWebhook = async (req, res, next) => {
  try {
    const event = req.body;
    // In production, verify webhook signature here

    if (event.type === 'payment_intent.succeeded') {
      const transactionId = event.data.object.id;
      const payment = await Payment.findOne({ transactionId });
      if (payment) {
        payment.status = 'success';
        payment.paidAt = new Date();
        await payment.save();

        const order = await Order.findById(payment.orderId);
        if (order) {
          if (order.status === 'pending') order.status = 'confirmed';
          if (order.paymentType === 'installment') {
            order.installmentPlan.paidInstallments += 1;
            if (order.installmentPlan.paidInstallments === order.installmentPlan.totalInstallments) {
              order.installmentPlan.status = 'completed';
              order.status = 'completed';
            }
          } else {
            order.installmentPlan.paidInstallments = 1;
            order.installmentPlan.status = 'completed';
            order.status = 'completed';
          }
          await order.save();
        }
      }
    }

    res.status(200).send('Webhook received');
  } catch (err) {
    next(err);
  }
};


// Initiate PayPal payment
exports.initiatePayPalPayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Create PayPal order
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: payment.amount.toFixed(2)
        },
        description: `Order payment for Omegally`,
        custom_id: payment.orderId.toString() // attach order ID
      }],
      application_context: {
        brand_name: 'Omegally',
        landing_page: 'BILLING',
        user_action: 'PAY_NOW',
        return_url: `${process.env.FRONTEND_URL}/payment/success?gateway=paypal`,
        cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`
      }
    });

    const paypalOrder = await client().execute(request);
    
    // Store PayPal order ID in payment record (optional)
    payment.transactionId = paypalOrder.result.id;
    await payment.save();

    // Return approval URL to frontend
    const approvalUrl = paypalOrder.result.links.find(link => link.rel === 'approve').href;
    res.json({ status: 'success', data: { approvalUrl, paypalOrderId: paypalOrder.result.id } });
  } catch (err) {
    next(err);
  }
};

// Capture PayPal payment (called after user approval)
exports.capturePayPalPayment = async (req, res, next) => {
  try {
    const { paypalOrderId } = req.body;
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({});
    const capture = await client().execute(request);

    // Find payment by transactionId (which we stored as paypalOrderId)
    const payment = await Payment.findOne({ transactionId: paypalOrderId });
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    // Update payment status
    payment.status = 'success';
    payment.paymentMethod = 'paypal';
    payment.transactionId = capture.result.id; // capture ID
    payment.paidAt = new Date();
    await payment.save();

    // Update order
    await updateOrderAfterPayment(payment.orderId, payment.installmentNumber);

    res.json({ status: 'success', message: 'Payment captured' });
  } catch (err) {
    next(err);
  }
};
// Initiate Flutterwave payment
exports.initiateFlutterwavePayment = async (req, res, next) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId).populate('orderId');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });

    const order = payment.orderId;

    // Prepare Flutterwave payload
    const payload = {
      tx_ref: `tx-${payment._id}-${Date.now()}`,
      amount: payment.amount,
      currency: 'USD',
      redirect_url: `${process.env.FRONTEND_URL}/payment/success?gateway=flutterwave`,
      payment_options: 'card,banktransfer,ussd',
      meta: {
        orderId: payment.orderId.toString(),
        paymentId: payment._id.toString()
      },
      customer: {
        email: order.contact.email,
        name: order.contact.name,
        phonenumber: order.contact.phone
      },
      customizations: {
        title: 'Omegally Payment',
        description: `Payment for order ${order.orderNumber}`,
        logo: 'https://your-logo-url.com/logo.png'
      }
    };

    const response = await axios.post(
      'https://api.flutterwave.com/v3/payments',
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.FLUTTERWAVE_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.status === 'success') {
      // Store Flutterwave transaction reference
      payment.transactionId = response.data.data.id;
      await payment.save();
      res.json({ status: 'success', data: { paymentLink: response.data.data.link } });
    } else {
      throw new Error('Flutterwave initiation failed');
    }
  } catch (err) {
    next(err);
  }
};

// Flutterwave webhook
exports.flutterwaveWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['verif-hash'];
    if (!signature || signature !== process.env.FLUTTERWAVE_SECRET_HASH) {
      return res.status(401).send('Unauthorized');
    }

    const event = req.body;
    if (event.event === 'charge.completed' && event.data.status === 'successful') {
      const payment = await Payment.findById(event.data.meta.paymentId);
      if (payment) {
        payment.status = 'success';
        payment.paymentMethod = 'flutterwave';
        payment.transactionId = event.data.id;
        payment.paidAt = new Date();
        await payment.save();

        await updateOrderAfterPayment(payment.orderId, payment.installmentNumber);
      }
    }
    res.status(200).send('Webhook received');
  } catch (err) {
    next(err);
  }
};

// Helper to update order after payment
async function updateOrderAfterPayment(orderId, installmentNumber) {
  const order = await Order.findById(orderId);
  if (!order) return;

  if (order.status === 'pending') order.status = 'confirmed';

  if (order.paymentType === 'installment') {
    order.installmentPlan.paidInstallments += 1;
    if (order.installmentPlan.paidInstallments === order.installmentPlan.totalInstallments) {
      order.installmentPlan.status = 'completed';
      order.status = 'completed';
    }
  } else {
    order.installmentPlan.paidInstallments = 1;
    order.installmentPlan.status = 'completed';
    order.status = 'completed';
  }

  await order.save();
}