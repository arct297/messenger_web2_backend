const path = require('path');
const User = require('../models/user');

// Получение текущих настроек пользователя
exports.getSettings = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            username: user.username,
            email: user.email
        });
    } catch (error) {
        console.error("Error fetching user settings:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Обновление никнейма пользователя
exports.updateSettings = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.username = username;
        await user.save();

        res.json({ message: 'Username updated successfully', username: user.username });
    } catch (error) {
        console.error("Error updating username:", error);
        res.status(500).json({ message: 'Error updating username' });
    }
};

// Отображение страницы настроек
exports.drawSettingsPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'settings.html'));
};
