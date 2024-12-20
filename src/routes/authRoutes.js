const express = require('express');
const { signUpController, loginController } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signUpController); // User signup
router.post('/login', loginController);   // User login

module.exports = router;
