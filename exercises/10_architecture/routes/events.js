const express = require('express');
const router = express.Router();
const sessionAuthMiddleware = require('../middleware/sessionAuthMiddleware');
const eventController = require('../controllers/eventController');

// Protect the routes with the sessionAuthMiddleware
router.get('/', sessionAuthMiddleware, eventController.list);
router.post('/', sessionAuthMiddleware, eventController.create);
router.put('/:id', sessionAuthMiddleware, eventController.update);
router.delete('/:id', sessionAuthMiddleware, eventController.delete);

module.exports = router;
