const express = require('express');
const router = express.Router();
const { loginUser, signUpUser, drawSignUpPage, drawLogInPage } = require('../GenControllers/authController');

router.post('/login', loginUser);
router.get('/login', drawLogInPage);

router.get('/signup', drawSignUpPage);
router.post('/signup', signUpUser);

module.exports = router;
