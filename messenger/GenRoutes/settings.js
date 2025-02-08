const express = require('express');
const router = express.Router();

const authenticate = require('../middlewares/authenticate');

const { drawSettingsPage } = require('../GenControllers/settingsController');

router.get('/', authenticate, drawSettingsPage);

module.exports = router;
