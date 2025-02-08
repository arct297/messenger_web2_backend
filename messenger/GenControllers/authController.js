const path = require('path');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const emailService = require('../services/emailService');
const User = require('../models/user');
const Session = require('../models/session');
const tokenService = require('../services/tokenService');

exports.drawSignUpPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'SignupPage.html'));
};

exports.drawLogInPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'LogInPage.html'));
};

exports.signUpUser = async (req, res) => {
    try {
        const { login, password, email, username, staySignedIn } = req.body;

        const existingUser = await User.findOne({ $or: [{ login }, { email }, { username }] });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists', code: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 15);
        const verificationCode = crypto.randomBytes(20).toString('hex');

        const newUser = new User({ login, password: hashedPassword, email, username, staySignedIn, verificationCode });
        await newUser.save();

        const verificationLink = `http://yourwebsite.com/auth/confirm?email=${email}&code=${verificationCode}`;
        await emailService.sendVerificationEmail(email, verificationLink);

        res.status(201).json({ message: 'Signup successful. Check your email to verify.', code: 201 });

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

exports.confirmEmail = async (req, res) => {
    try {
        const { email, code } = req.query;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found', code: 404 });
        if (user.isVerified) return res.status(400).json({ message: 'Email already verified', code: 400 });
        if (user.verificationCode !== code) return res.status(400).json({ message: 'Invalid verification code', code: 400 });

        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();

        res.redirect('/auth/login');

    } catch (error) {
        res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

exports.loginUser = async (req, res) => {
    const { login, password } = req.body;

    if (!login || !password) {
        return res.status(400).json({ message: 'All fields are required', code: 400 });
    }

    try {
        const existingUser = await User.findOne({ login });
        if (!existingUser) {
            return res.status(401).json({ message: 'Wrong login or password', code: 401 });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Wrong login or password', code: 401 });
        }

        if (!existingUser.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.', code: 403 });
        }

        await Session.deleteMany({ user: existingUser._id });

        const payload = { id: existingUser._id, role: existingUser.role };
        const accessToken = tokenService.generateAccessToken(payload);
        const refreshToken = tokenService.generateRefreshToken(payload);

        const session = new Session({ user: existingUser._id, accessToken, refreshToken });
        await session.save();

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.cookie('selfUserId', existingUser._id.toString(), {
            httpOnly: false,
            sameSite: 'Strict',
        });

        return res.status(200).json({ message: 'User logged in successfully', code: 200 });
    } catch {
        res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};