'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }
});

let User = mongoose.model('User', userSchema);

module.exports = {User};
