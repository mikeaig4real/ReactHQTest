const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const {
    validateAccount,
    subConfirmEmail
} = require('../../utils');

/**
 * 
 * @param {Object} req - Request Object
 * @param {Object} res - Response Object
 * @returns {Object} Returns an Error Object or Custom Success Object
 */

const registerUser = async (req, res) => {
    const { firstName, lastName, email, phoneNo, course, accountNo } = { ...req.params, ...req.query, ...req.body };
    // check for crucial fields
    if (!firstName || !lastName || !phoneNo || !email || !course || !accountNo) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: false,
            message: 'Missing crucial fields'
        });
    };
    // validate account number existence
    const { status } = await validateAccount({ account_number: accountNo });
    if (!status) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: false,
            message: "Account number does not exist"
        });
    };
    // check if user already exists
    const { data: isExistingUser } = await User.find({ email });
    if (isExistingUser) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: false,
            message: "Email already linked to existing registration"
        });
    };
    // send email
    await subConfirmEmail({
        name: `${firstName} ${lastName}`,
        email,
        type: 'mailgun',
    });
    // create user
    await User.create({
        firstName,
        lastName,
        email,
        phoneNo,
        course,
        accountNo
    });
    // return success
    return res.status(StatusCodes.OK).json({
        status: true,
        message: 'User created successfully'
    });
}


module.exports = {
    registerUser,
}