const express = require('express');
const router = express.Router();
const { getChatList, getChatById, sendMessage } = require('../GenControllers/chatsController');

router.get('/', getChatList);

router.get('/:id', getChatById);

router.post('/:id/messages', sendMessage);

module.exports = router;
