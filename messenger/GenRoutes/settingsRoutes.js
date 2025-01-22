const express = require('express');
const { updateUserSettings } = require('../GenControllers/settingsController');
const authenticate = require('../middlewares/authenticate'); // Миддлвар для проверки токена

const router = express.Router();

// PUT запрос для обновления настроек
router.put('/', authenticate, updateUserSettings);

module.exports = router;
