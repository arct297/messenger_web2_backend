const tokenService = require('../services/tokenService');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Session = require('../models/session');

async function getUserSessions(userId) {
    try {
        return await Session.find({ user: userId });
    } catch (error) {
        console.error('Error fetching sessions:', error);
        throw new Error('Failed to retrieve sessions');
    }
}

const authenticate = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // console.log("Access Token:", accessToken);
    // console.log("Refresh Token:", refreshToken);

    if (!refreshToken) {
        console.error('No refresh token, redirecting...');
        return res.redirect('/auth/login');
    }

    let user;
    try {
        user = tokenService.decodeToken(refreshToken);
    } catch (error) {
        console.error('Decode refresh token error, redirecting...');
        return res.redirect('/auth/login');
    }

    const sessionsList = await getUserSessions(user.id);
    if (sessionsList.length === 0) {
        console.error('No active sessions, redirecting...');
        return res.redirect('/auth/login');    
    }

    let hasSession = false;
    for (const session of sessionsList) {
        if (await bcrypt.compare(refreshToken, session.refreshToken)) {
            hasSession = true;
            break;
        }
    }

    if (!hasSession) {
        console.error('No valid session found, redirecting...');
        return res.redirect('/auth/login');    
    }

    if (!accessToken) {
        try {
            console.log("Access token expired, generating new one...");
            const newAccessToken = await tokenService.refreshAccessToken(refreshToken);
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                sameSite: 'Strict',
                maxAge: 60 * 60 * 1000, // 1 час
            });

            req.user = tokenService.decodeToken(newAccessToken);
            console.log("New access token issued:", req.user);
            return next();
        } catch (refreshError) {
            console.error('Refresh token invalid:', refreshError.message);
            return res.redirect('/auth/login');
        }
    }

    try {
        req.user = tokenService.decodeToken(accessToken);
        next(); 
    } catch (error) {
        console.log("Access token error:", error);
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                console.log("Access token expired, generating new one...");
                const newAccessToken = await tokenService.refreshAccessToken(refreshToken);
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    sameSite: 'Strict',
                    maxAge: 60 * 60 * 1000,
                });

                req.user = tokenService.decodeToken(newAccessToken);
                return next();
            } catch (refreshError) {
                console.error('Refresh token invalid:', refreshError.message);
                return res.redirect('/auth/login');
            }
        }

        console.log("Redirecting to login...");
        res.redirect('/auth/login');
    }
};

module.exports = authenticate;
