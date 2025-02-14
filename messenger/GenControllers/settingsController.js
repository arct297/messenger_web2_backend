const path = require('path');


const authenticate = require('../middlewares/authenticate');

const User = require('../models/user');

// Get user settings
exports.getSettings =  async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            username: user.username,
            email: user.email,
            theme: user.settings.theme,
            notifications: user.settings.notifications
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// Update user settings
exports.updateSettings = async (req, res) => {
    try {
        const { username, email, password, theme, notifications } = req.body;
        const user = await User.findById(req.user.id);

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;
        if (theme) user.settings.theme = theme;
        if (typeof notifications !== 'undefined') user.settings.notifications = notifications;

        await user.save();
        res.json({ message: 'Settings updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating settings' });
    }
}

exports.drawSettingsPage = (req, res) => {
    console.log("received");
    const pagePath = path.join(__dirname, '..', 'frontend', 'settings.html');
    console.log(pagePath);
    res.sendFile(pagePath);
};
