const checkSignUpData = async (req, res, next) => {
    try {
        const { login, password, email, username, staySignedIn } = req.body;

        if (!login || !password || !email || !username) {
            return res.status(400).json({
                message: 'All fields are required',
                code: 400,
                status: "error"
            });
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

        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
            code: 500,
            status: 'error',
        });
    }
};

module.exports = checkSignUpData;
