'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const {salt, auth} = require('../constants');

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        unique: true,
        validate: {
            validator: (email) => {
               return validator.isEmail(email);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    }, tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

/**
* @override mongoose.toJSON()
*/

UserSchema.methods.toJSON = function() {
  let user = this;
  let userObj = user.toObject();

  return _.pick(userObj, ['_id', 'email', 'name']);
};

/**
* @return token
*/
UserSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = auth;
    let token = jwt.sign({_id: user._id.toHexString(), access}, salt).toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
       return token;
    });
};

/**
* @return User by token
*/
UserSchema.statics.findByToken = function(token) {
   let User = this;
   let decoded;

   try {
       decoded = jwt.verify(token, salt);
   } catch (error) {
      return new Promise((resolve, reject) => {
          reject();
      });
   }

   return User.findOne({
       '_id': decoded._id,
       'tokens.token': token,
       'tokens.access': auth
   });

};

let User = mongoose.model('User', UserSchema);

module.exports = {User};
