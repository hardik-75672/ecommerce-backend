const express=require('express');
const { createProduct, fetchAllProduct, updateProduct, fetchProductById } = require('../controller/product');
const router=express.Router();

router.post('/',createProduct)
    .get('/',fetchAllProduct)
    .get('/:_id', fetchProductById)
    .patch('/:_id', updateProduct)

exports.router=router;