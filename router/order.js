const express = require('express');
const { createOrder, fetchOrdersByUser, deleteOrder, updateOrder } = require('../controller/order');

const router = express.Router();
//  /orders is already added in base path
router.post('/', createOrder)
      .get('/own/', fetchOrdersByUser)
      .delete('/:id', deleteOrder)
      .patch('/:id', updateOrder)


exports.router = router; 