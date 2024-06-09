const express = require('express');
const { createOrder, fetchOrdersByUser, deleteOrder, updateOrder, sendOrderMail, fecthAll, fetchOrders } = require('../controller/order');

const router = express.Router();
//  /orders is already added in base path
router.post('/', createOrder)
      .get('/own/', fetchOrdersByUser)
      .delete('/:id', deleteOrder)
      .patch('/:id', updateOrder)
      .post('/sendMail', sendOrderMail)
      .get('/all/:id', fetchOrders)



exports.router = router; 