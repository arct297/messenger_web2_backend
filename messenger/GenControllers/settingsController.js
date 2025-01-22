const User = require('../models/user'); // Подключаем модель пользователя

const updateUserSettings = async (req, res) => {
    try {
        const userId = req.user.id; // Предполагается, что userId берется из токена авторизации
        const { name, avatar, password } = req.body; // Получаем поля из тела запроса

        const updateData = {};
        if (name) updateData.name = name;
        if (avatar) updateData.avatar = avatar;
        if (password) updateData.password = password;

        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

        res.status(200).json({ message: "Settings updated successfully", user: updatedUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update settings" });
    }
};

module.exports = { updateUserSettings };
