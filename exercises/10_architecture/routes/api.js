const express = require('express');
const apiController = require('../controllers/apiController');
const tokenAuthMiddleware = require('../middleware/tokenAuthMiddleware');

const router = express.Router();

// Public route to log in and get a token
router.post('/api/login', apiController.login);

// Routes for events (protected by JWT)
router.get('/api/events', tokenAuthMiddleware, apiController.all);
router.get('/api/events/:id', tokenAuthMiddleware, apiController.show);
router.put('/api/events/:id', tokenAuthMiddleware, apiController.update);

module.exports = router;
