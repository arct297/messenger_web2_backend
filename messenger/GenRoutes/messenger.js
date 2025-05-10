const express = require('express');

const authenticate = require('../middlewares/authenticate');


const router = express.Router();

const { drawMessengerPage } = require('../GenControllers/messengerController');

router.get('/', authenticate, drawMessengerPage);

module.exports = router;
