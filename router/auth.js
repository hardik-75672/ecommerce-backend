const express = require('express');
const { createUser, loginUser, checkAuth, logout, resetPassword, resetPasswordRequest } = require('../controller/auth');
const passport=require('passport');
const router = express.Router();
//  /auth is already added in base path
console.log("lp")
router.post('/signup', createUser)
        .post('/login',passport.authenticate('local'), loginUser)
        .get('/check',passport.authenticate('jwt'), checkAuth)
        .get('/logout', logout)
        // .post('/reset-password-request', resetPasswordRequest)
        .post('/reset-password', resetPassword)
exports.router = router;