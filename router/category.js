const express=require('express');
const { fetchCategory, createCategory } = require('../controller/category');
const router=express.Router();

router.post('/',createCategory)
.get('/',fetchCategory)

exports.router=router;