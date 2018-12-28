'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo-model');
const {User} = require('./models/user-model');

const app = express();

app.use(bodyParser.json());

app.post('/todo', (request, resonse) => {
    let todo = new Todo({
        text: request.body.text
    });

    todo.save().then(todoDoc => {
       resonse.send(todoDoc);
    }, (error) => {
        resonse.status(400).send(error);
    });

});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
