const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Please supply a name',
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowerCase: true,
        trim: true,
        validate: [validator.isEmail, 'Invalid Email Address'],
        required: 'Please supply an email address'
    },
    password: {
        type: String,
        required: true
      },
    confirmPassword: {
        type: String,
        required: true
      },
}, {timestamps: true});


module.exports = mongoose.model('User', userSchema)