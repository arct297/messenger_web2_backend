const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
} = require('../GenControllers/messagesController');

const authenticate = require('../middlewares/authenticate')

router.post('/', authenticate, createMessage);
router.get('/', authenticate, getMessages);

module.exports = router;
