const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  searchMessages,
} = require('../GenControllers/messagesController');

const authenticate = require('../middlewares/authenticate')

router.post('/', authenticate, createMessage);
router.get('/', authenticate, getMessages);
router.get('/search', authenticate, searchMessages);

module.exports = router;
