exports.loginUser = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    res.status(200).json({ message: 'User logged in successfully' });
};


exports.signUpUser = (req, res) => {
    const { login, password, email, username } = req.body;
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
    
    console.log(`User ${username} ${password} ${email} ${login}`)

    res.status(201).json(
        { 
            message: 'User signed up successfully',
            code: 201,
            status: "success"
        }
    );
};
