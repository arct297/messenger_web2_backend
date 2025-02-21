const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  updateMessage,
  deleteMessage,
} = require('../GenControllers/messagesController');

const authenticate = require('../middlewares/authenticate')

router.post('/', authenticate, createMessage);
router.get('/', authenticate, getMessages);
router.put('/:messageId', authenticate, updateMessage);
router.delete('/:messageId', authenticate, deleteMessage);


module.exports = router;
