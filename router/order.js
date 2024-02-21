const express = require('express');
const { createOrder, fetchOrdersByUser, deleteOrder, updateOrder, sendOrderMail } = require('../controller/order');

const router = express.Router();
//  /orders is already added in base path
router.post('/', createOrder)
      .get('/own/', fetchOrdersByUser)
      .delete('/:id', deleteOrder)
      .patch('/:id', updateOrder)
      .post('/sendMail', sendOrderMail)


exports.router = router; 