exports.loginUser = (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    res.status(200).json({ message: 'User logged in successfully' });
};

exports.signUpUser = (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    res.status(201).json({ message: 'User signed up successfully' });
};
