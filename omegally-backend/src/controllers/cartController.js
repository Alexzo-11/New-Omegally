const User = require('../models/User');
const Product = require('../models/Product');

// Get user's cart
exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('cart.productId');
    res.status(200).json({ status: 'success', data: user.cart });
  } catch (err) {
    next(err);
  }
};

// Add item to cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'Product ID and quantity required' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const user = await User.findById(req.user.id);
    const existingItem = user.cart.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    res.status(200).json({ status: 'success', data: user.cart });
  } catch (err) {
    next(err);
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: 'Valid quantity required' });
    }

    const user = await User.findById(req.user.id);
    const item = user.cart.find(item => item.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.quantity = quantity;
    await user.save();
    res.status(200).json({ status: 'success', data: user.cart });
  } catch (err) {
    next(err);
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(item => item.productId.toString() !== productId);
    await user.save();
    res.status(200).json({ status: 'success', data: user.cart });
  } catch (err) {
    next(err);
  }
};

// Clear cart
exports.clearCart = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    res.status(200).json({ status: 'success', data: [] });
  } catch (err) {
    next(err);
  }
};