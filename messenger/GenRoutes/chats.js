const express = require('express');
const router = express.Router();
const { getChatList, getChatById, sendMessage, createChat} = require('../GenControllers/chatsController');

const authenticate = require('../middlewares/authenticate');


router.get('/', getChatList);

router.get('/:id', getChatById);

router.post('/:id/messages', sendMessage);

router.post('/', authenticate, createChat);

module.exports = router;
