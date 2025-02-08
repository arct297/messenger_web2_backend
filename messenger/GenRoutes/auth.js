const express = require('express');
const router = express.Router();
const { loginUser, signUpUser, drawSignUpPage, drawLogInPage, logOut, confirmEmail } = require('../GenControllers/authController');
const checkLoginData = require('../middlewares/login');
const checkSignUpData = require('../middlewares/signup');

router.get('/login', drawLogInPage);
router.post('/login', checkLoginData, loginUser);

router.get('/signup', drawSignUpPage);
router.post('/signup', checkSignUpData, signUpUser);

router.get('/confirm', confirmEmail);

router.post('/logout', logOut);

module.exports = router;
