const express=require('express');
const { createBrand, fetchBrand } = require('../controller/brand');
const router=express.Router();

router.post('/',createBrand)
.get('/',fetchBrand)

exports.router=router;