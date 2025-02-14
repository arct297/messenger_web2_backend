const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { getSettings, updateSettings, drawSettingsPage } = require('../GenControllers/settingsController');

router.get('/', authenticate, drawSettingsPage);
router.get('/r', authenticate, getSettings);
router.put('/', authenticate, updateSettings);

module.exports = router;