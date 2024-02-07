const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

router.post('/user/signup', authController.signup)
router.post('/user/login', authController.login)

module.exports = router;