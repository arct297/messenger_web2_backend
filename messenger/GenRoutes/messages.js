const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
} = require('../GenControllers/messagesController');

router.post('/', createMessage);
router.get('/', getMessages);

module.exports = router;
