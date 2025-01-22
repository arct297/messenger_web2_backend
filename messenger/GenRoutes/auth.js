const express = require('express');
const router = express.Router();
const { loginUser, signUpUser, drawSignUpPage, drawLogInPage } = require('../GenControllers/authController');
const checkLoginData = require('../middlewares/login');
const checkSignUpData = require('../middlewares/signup');

router.get('/login', drawLogInPage);
router.post('/login', checkLoginData, loginUser);

router.get('/signup', drawSignUpPage);
router.post('/signup', checkSignUpData, signUpUser);

module.exports = router;
