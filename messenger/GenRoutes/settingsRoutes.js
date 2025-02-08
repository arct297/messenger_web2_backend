const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate');
const { drawSettingsPage, updateUserSettings } = require('../GenControllers/settingsController');

router.get('/', authenticate, drawSettingsPage);

router.post('/update', authenticate, updateUserSettings);

module.exports = router;
