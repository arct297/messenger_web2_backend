module.exports = (req, res, next) => {
    const { body } = req;
    if (Object.keys(body).length === 0) {
        return res.status(400).json({ message: 'Request body cannot be empty' });
    }
    next();
};
