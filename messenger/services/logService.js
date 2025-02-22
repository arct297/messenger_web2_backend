const Log = require('../models/Log');

async function logAction(action, initiator, details = {}) {
    try {
        await Log.create({ action, initiator, details });
    } catch (error) {
        console.error('Error during log creating:', error);
    }
}

module.exports = { logAction };