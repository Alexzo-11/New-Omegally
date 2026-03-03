const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { jwtSecret, jwtExpiresIn, jwtRefreshSecret, jwtRefreshExpiresIn } = require('../config/env');

const signToken = (id, role) => jwt.sign({ id, role }, jwtSecret, { expiresIn: jwtExpiresIn });
const signRefreshToken = (id) => jwt.sign({ id }, jwtRefreshSecret, { expiresIn: jwtRefreshExpiresIn });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = await User.create({ name, email, password, phone, address, role: 'customer' });

    const accessToken = signToken(newUser._id, newUser.role);
    const refreshToken = signRefreshToken(newUser._id);

    newUser.password = undefined;

    res.status(201).json({
      status: 'success',
      data: { user: newUser, accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const accessToken = signToken(user._id, user.role);
    const refreshToken = signRefreshToken(user._id);

    user.password = undefined;

    res.status(200).json({
      status: 'success',
      data: { user, accessToken, refreshToken },
    });
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

    const decoded = await promisify(jwt.verify)(refreshToken, jwtRefreshSecret);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: 'User not found' });

    const newAccessToken = signToken(user._id, user.role);

    res.status(200).json({ status: 'success', data: { accessToken: newAccessToken } });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }
    next(err);
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};