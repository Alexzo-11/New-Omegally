import apiClient, { setAuthTokens, clearAuthTokens } from '../api/client';
const express = require('express');
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', protect, authController.logout);

module.exports = router;