const express = require('express');
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', cartController.getCart);
router.post('/items', cartController.addToCart);
router.put('/items/:productId', cartController.updateCartItem);
router.delete('/items/:productId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

module.exports = router;