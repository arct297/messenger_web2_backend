const express = require('express');
const router = express.Router();
const { drawSettingsPage } = require('../GenControllers/settingsController');

router.get('/', drawSettingsPage);

module.exports = router;
