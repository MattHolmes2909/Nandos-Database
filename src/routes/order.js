const express = require('express');

const orderController = require('../controllers/order');

const router = express.Router();

router.post('/', orderController.create);

router.get('/', orderController.read);

router.get('/:orderId', orderController.readById);

router.patch('/:orderId', orderController.update);

module.exports = router;