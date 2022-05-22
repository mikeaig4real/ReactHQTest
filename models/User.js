const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const UserSchema = mongoose.Schema({
    username: {
            required: [true, 'A username is needed'],
            type: String,
            maxLength: [30, 'name length cannot be bigger than 30'],
            minLength: [10, 'name length cannot be smaller than 10'],
            trim: true,
        },
    password: {
        type: String,
        required: [true, 'A password is needed'],
    },
    }, {
        writeConcern: {
            w: 'majority',
            j: true,
            wtimeout: 1000
        },
})


UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


UserSchema.methods.getToken = function () {
    return jwt.sign({
        userId: this._id,
        username: this.username
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_LIFE
    });
}

UserSchema.methods.comparePwd = async function (pwd) {
    const correct = await bcrypt.compare(pwd, this.password);
    return correct;
}

module.exports = mongoose.model('User', UserSchema);