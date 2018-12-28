'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://todo-app:todoapppass123@ds145194.mlab.com:45194/todo-app', { useNewUrlParser: true });

module.exports = {mongoose};
