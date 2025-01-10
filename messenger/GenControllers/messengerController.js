const path = require('path');

const Session = require('../models/session');


exports.drawMessengerPage = (req, res) => {
    const pagePath = path.join(__dirname, '..', 'frontend', 'messenger.html');
    res.sendFile(pagePath);
};


