const path = require('path');


exports.drawMessengerPage = (req, res) => {
    const pagePath = path.join(__dirname, '..', 'frontend', 'messenger.html');
    res.sendFile(pagePath);
};


