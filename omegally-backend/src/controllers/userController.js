const User = require('../models/Users');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address },
      { new: true, runValidators: true }
    );
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    next(err);
  }
};

// Admin only
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: 'success', data: users });
  } catch (err) {
    next(err);
  }
};