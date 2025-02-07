const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const User = require('../models/user');

// Получение настроек пользователя
router.get('/', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({
            username: user.username,
            email: user.email,
            theme: user.settings.theme,
            notifications: user.settings.notifications
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
});

// Обновление настроек пользователя
router.put('/', authenticate, async (req, res) => {
    try {
        const { username, email, password, theme, notifications } = req.body;
        const user = await User.findById(req.user.id);

        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;
        if (theme) user.settings.theme = theme;
        if (typeof notifications !== 'undefined') user.settings.notifications = notifications;

        await user.save();
        res.json({ message: 'Настройки обновлены' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка обновления' });
    }
});

module.exports = router;
