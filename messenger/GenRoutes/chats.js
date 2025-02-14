const express = require('express');
const router = express.Router();
const {
  getChatList,
  getChatById,
  createChat,
  deleteChat,
} = require('../GenControllers/chatsController');

const authenticate = require('../middlewares/authenticate')

router.get('/', authenticate, getChatList);
router.post('/', authenticate, createChat);
router.get('/:id', getChatById);
router.delete('/:id', deleteChat);

module.exports = router;
