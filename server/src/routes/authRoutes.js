const express = require('express');
const authrouter = express.Router();
const authController = require('../controller/authController.js');

authrouter.post('/register', authController.register);
authrouter.post('/login', authController.login);
authrouter.post('/logout',authController.logout);

module.exports = authrouter;
