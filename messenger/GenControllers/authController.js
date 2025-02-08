const bcrypt = require('bcrypt');
const User = require('../models/user');
const sendVerificationEmail = require('../services/emailService');

// Регистрация пользователя
exports.signUpUser = async (req, res) => {
    try {
        const { login, password, email, username, staySignedIn } = req.body;

        const existingUser = await User.findOne({
            $or: [{ login }, { email }, { username }],
        });

        if (existingUser) {
            let conflictField;
            if (existingUser.login === login) conflictField = 'login';
            if (existingUser.email === email) conflictField = 'email';
            if (existingUser.username === username) conflictField = 'username';

            return res.status(409).json({
                message: `${conflictField} already exists`,
                conflictField: conflictField,
                code: 409,
                status: 'error',
            });
        }

        const saltRounds = 15;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const emailResponse = await sendVerificationEmail(email);

        if (!emailResponse.success) {
            return res.status(400).json({
                message: 'Invalid email address. Please try again.',
                code: 400,
                status: 'error',
            });
        }

        const newUser = new User({
            login,
            password: hashedPassword,
            email,
            username,
            staySignedIn,
            verification_code: emailResponse.verificationCode,
            is_verified: false,
        });

        await newUser.save();

        res.status(201).json({
            message: 'Verification email sent. Please check your inbox.',
            code: 201,
            status: 'success',
        });

    } catch (error) {
        console.error('Error during user signup:', error);
        res.status(500).json({
            message: 'Internal server error',
            code: 500,
            status: 'error',
        });
    }
};

// Подтверждение почты
exports.confirmEmail = async (req, res) => {
    try {
        const { email, code } = req.query;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.verification_code !== code) {
            return res.status(400).json({ message: 'Invalid verification code.' });
        }

        user.is_verified = true;
        user.verification_code = undefined; // Удаление кода после подтверждения
        await user.save();

        res.redirect('/auth/login'); // Редирект на страницу логина
    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ message: 'Verification failed.' });
    }
};
