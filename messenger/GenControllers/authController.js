const path = require('path');

const tokenService = require('../services/tokenService');
const User = require('../models/user');
const Session = require('../models/session')


// Draw pages:
exports.drawSignUpPage = (req, res) => {
    const pagePath = path.join(__dirname, '..', 'frontend', 'SignupPage.html');
    res.sendFile(pagePath);
};

exports.drawLogInPage = (req, res) => {
    const pagePath = path.join(__dirname, '..', 'frontend', 'LogInPage.html');
    res.sendFile(pagePath);
};


// Operate log in request:
exports.loginUser = async (req, res) => {
    const { login, password } = req.body;

    // Request data validation:
    if (!login || !password) {
        return res.status(400).json(
            { 
                message: 'All fields are required',
                code: 400, 
                status: "error"
            }
        );
    }

    // Main part
    try {
        // Try to find user with passed login and password:
        // TODO: password encrypting
        const existingUser = await User.findOne(
            {
                login : login, 
                password : password
            }
        );
        if (!existingUser) {
            // User with such login and password is not found:
            return res.status(401).json(
                { 
                    message: 'Wrong login or password',
                    code: 401, 
                    status: "error"
                }
            )
        } 

        await Session.deleteMany({ user : existingUser._id})

        const payload = { id: existingUser._id, role: existingUser.role };
        const accessToken = tokenService.generateAccessToken(payload);
        const refreshToken = tokenService.generateRefreshToken(payload);
        
        const session = new Session({ user : existingUser._id, accessToken : accessToken, refreshToken : refreshToken});
        await session.save();

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            // secure: true,   
            sameSite: 'Strict',
            maxAge: 60 * 60 * 1000, 
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            // secure: true,
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json(
            {
                message: 'User logged in successfully',
                code: 200,
                status: 'success',
            }
        );

    } catch {
        console.error('Error during user login');
        res.status(500).json({
          message: 'Internal server error',
          code: 500,
          status: 'error',
        });
    }
};


exports.signUpUser = async (req, res) => {
    const { login, password, email, username, staySignedIn } = req.body;
    if (!login || !password || !email || !username) {
        return res.status(400).json(
            { 
                message: 'All fields are required',
                code: 400, 
                status: "error"
            }
        );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: 'Invalid email format',
            code: 400,
            status: "error",
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message: 'Password must be at least 6 characters long',
            code: 400,
            status: "error"
        });
    }
    
    try {
        // Checking for uniqueness of values
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
    
        // Creating new user
        const newUser = new User({ login, password, email, username, staySignedIn });
        await newUser.save();
    
        res.status(201).json({
          message: 'User signed up successfully',
          code: 201,
          status: 'success',
        });
        // res.redirect('/');

    } catch (error) {
        console.error('Error during user signup:', error);
        res.status(500).json({
          message: 'Internal server error',
          code: 500,
          status: 'error',
        });
    }
};

