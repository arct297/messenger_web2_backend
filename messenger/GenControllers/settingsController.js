const User = require('../models/user');

const drawSettingsPage = (req, res) => {
    res.send('Settings Page Loaded');
};

const updateUserSettings = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, avatar, password } = req.body;

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

module.exports = { drawSettingsPage, updateUserSettings };
