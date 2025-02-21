const express = require('express');
const router = express.Router();
const { 
  createMessage, 
  getMessages, 
  updateMessage, 
  deleteMessage, 
  searchMessages 
} = require('../GenControllers/messagesController');

const authenticate = require('../middlewares/authenticate');

router.post('/', authenticate, createMessage);
router.get('/', authenticate, getMessages);
router.put('/:messageId', authenticate, updateMessage);
router.delete('/:messageId', authenticate, deleteMessage);
router.get('/search', authenticate, searchMessages); // Маршрут для поиска

module.exports = router;
