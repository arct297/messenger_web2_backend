const express = require('express');
const router = express.Router();
const {
  getChatList,
  getChatById,
  createChat,
  deleteChat,
} = require('../GenControllers/chatsController');

router.get('/', getChatList);
router.get('/:id', getChatById);
router.post('/', createChat);
router.delete('/:id', deleteChat);

module.exports = router;
