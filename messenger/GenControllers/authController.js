const path = require('path');

const User = require('../models/user');


exports.drawSignUpPage = (req, res) => {
    const pagePath = path.join(__dirname, '..', 'frontend', 'SignupPage.html');
    res.sendFile(pagePath);
};

exports.drawLogInPage = (req, res) => {
    const pagePath = path.join(__dirname, '..', 'frontend', 'LogInPage.html');
    res.sendFile(pagePath);
};

exports.loginUser = async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
        return res.status(400).json(
            { 
                message: 'All fields are required',
                code: 400, 
                status: "error"
            }
        );
    }

    try {
        const existingUser = await User.findOne({login : login, password : password});
        if (!existingUser) {
            return res.status(403).json(
                { 
                    message: 'Wrong login or password',
                    code: 403, 
                    status: "error"
                }
            )
        } 
        res.status(200).json({
            message: 'User logged in successfully',
            code: 201,
            status: 'success',
        });

    } catch {
        console.error('Error during user login', error);
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

