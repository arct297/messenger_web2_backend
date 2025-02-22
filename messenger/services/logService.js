const Log = require('../models/Log');

async function logAction(action, initiator, details = {}) {
    try {
        await Log.create({ action, initiator, details });
    } catch (error) {
        console.error('Ошибка при создании лога:', error);
    }
}

module.exports = { logAction };