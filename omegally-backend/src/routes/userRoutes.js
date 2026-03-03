const express = require('express');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // All routes below require authentication

router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

router.use(restrictTo('admin'));
router.get('/', userController.getAllUsers);
router.get('/profile', protect, userController.getProfile);

module.exports = router;