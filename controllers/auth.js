const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError,UnauthenticatedError } = require('../errors');

const registerUser = async (req, res) => {
    const oldUser = await User.findOne({ username: req.body.username });
    if (!oldUser) {
        const user = await User.create({
            ...req.body
        });
        const token = user.getToken();
        return res.status(StatusCodes.CREATED).json({
            username: user.username,
            token
        });
    };
    throw new BadRequestError(`Sorry ${oldUser.username} has been taken try new one please...`)
}

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        throw new BadRequestError('Please provide complete login credentials');
    }
    const user = await User.findOne({ username });
    if (!user) {
        throw new UnauthenticatedError('Invalid credentials');
    }
    const isCorrect = await user.comparePwd(password);
    if (!isCorrect) {
        throw new UnauthenticatedError('password is incorrect,try again...');
    }
    const token = user.getToken();
    return res.status(StatusCodes.OK).json({ username: user.username, token });
}


module.exports = {
    registerUser,
    loginUser,
}