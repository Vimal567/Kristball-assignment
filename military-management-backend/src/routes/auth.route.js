const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Login
router.post('/login', authController.login);

// Register (Admin only)
router.post('/register', authController.register);

module.exports = router;
