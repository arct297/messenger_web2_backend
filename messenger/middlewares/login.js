
const checkLoginData = async (req, res, next) => {
    try {
        const { login, password } = req.body;

        if (!login || !password) {
            return res.status(400).json(
                { 
                    message: 'All fields are required',
                    code: 400, 
                    status: "warning"
                }
            );
        }
        next();

    } catch (error) {
        return res.status(500).json(
            {
                message: 'Internal server error',
                code: 500,
                status: 'error',
            }
        )
    }
};

module.exports = checkLoginData;
