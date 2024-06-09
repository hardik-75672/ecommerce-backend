const express = require('express');
const { fetchUserById, updateUser, allUser } = require('../controller/user');

const router = express.Router();
//  /users is already added in base path
router.get('/own', fetchUserById)
      .get('/all-user', allUser)
      .patch('/:_id', updateUser)

exports.router = router;