const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer')) {
        throw new UnauthenticatedError('invalid token');
    }

    const token = header.split(' ')[1];
    try {
        const userInfo = await jwt.verify(token, process.env.JWT_SECRET);
        const {
            userId,
            username
        } = userInfo;
        req.user = { userId, username };
        next();
    } catch (error) {
        throw new UnauthenticatedError('invalid token');
    }
}

module.exports = auth;