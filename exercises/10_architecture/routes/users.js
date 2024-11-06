const express = require('express');
const router = express.Router();
const sessionAuthMiddleware = require('../middleware/sessionAuthMiddleware');
const userController = require('../controllers/userController');

// Logout route protected by sessionAuthMiddleware
router.post('/logout', sessionAuthMiddleware, userController.logout);

module.exports = router;
