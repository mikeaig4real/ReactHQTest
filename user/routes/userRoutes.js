const express = require('express');
const router = express.Router();

const {
    registerUser,
} = require('../controllers/userController');


// @route   POST api/v1/users/register
// @desc    Register user
// @access  Public
router.post('/register', registerUser);

module.exports = router