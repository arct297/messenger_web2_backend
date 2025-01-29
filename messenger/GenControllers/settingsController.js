const path = require('path');


exports.drawSettingsPage = (req, res) => {
    const settingsPath = path.join(__dirname, '..', 'frontend', 'settings.html');
    res.sendFile(settingsPath);
};


