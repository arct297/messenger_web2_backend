const express = require('express');
const router = express.Router();
const { drawMessengerPage } = require('../GenControllers/messengerController');

router.get('/', drawMessengerPage);

module.exports = router;
