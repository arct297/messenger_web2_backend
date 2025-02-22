const express = require('express');
const path = require('path');

const router = express.Router();

const {
    drawLogStatsPage,
    getLogsStats,
} = require('../GenControllers/adminController');

const authenticate = require('../middlewares/authenticate')

router.get('/log', authenticate, getLogsStats);
router.get('/logs', authenticate, drawLogStatsPage);

module.exports = router;
