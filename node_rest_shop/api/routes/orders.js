const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

const OrderControllers = require('../controllers/orders');

router.get('/', checkAuth, OrderControllers.get_all)

router.get('/:orderId', checkAuth, OrderControllers.get_one)

router.post('/', checkAuth, OrderControllers.create_order)

router.delete('/:orderId', checkAuth, OrderControllers.delete_one)

module.exports = router;