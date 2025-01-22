const tokenService = require('../services/tokenService')

const authenticate = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    console.log("Access ", accessToken)
    console.log("Refresh ", accessToken)

    if (!accessToken) {
        return res.redirect('/auth/login');
    }

    try {
        req.user = tokenService.decodeToken(accessToken);
        next(); 
    } catch (error) {
        console.log("error", error);
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                console.log("Expired");
                const newAccessToken = await tokenService.refreshAccessToken(refreshToken);
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    sameSite: 'Strict',
                    maxAge: 60 * 60 * 1000,
                }); 

                req.user = tokenService.decodeToken(newAccessToken);
                console.log(req.user);
                return next();

            } catch (refreshError) {
                console.error('Refresh token invalid:', refreshError.message);
                return res.redirect('/auth/login');
            }
        }

        console.log("red")
        res.redirect('/auth/login');
    }
};

module.exports = authenticate;
