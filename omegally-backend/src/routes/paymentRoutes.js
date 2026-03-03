const express = require('express');
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/webhook', paymentController.paymentWebhook); // public

router.use(protect);
router.post('/:paymentId/process', paymentController.processPayment);
router.post('/:paymentId/paypal/initiate', protect, paymentController.initiatePayPalPayment);
router.post('/paypal/capture', protect, paymentController.capturePayPalPayment);

module.exports = router;