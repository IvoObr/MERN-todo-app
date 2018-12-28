'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo-model');
const {User} = require('./models/user-model');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (request, response) => {
    let todo = new Todo({
        text: request.body.text
    });

    todo.save().then(todoDoc => {
        response.send(todoDoc);
    }, (error) => {
        response.status(400).send(error);
    });

});

app.get('/todos', (request, response) => {
    Todo.find().then(allTodos => {
        response.send({allTodos});
    }, (error) => {
        response.status(400).send(error);
    });
});

app.get('/todos/:id', (request, response) => {
   let id = request.params.id;

   if (!ObjectID.isValid(id)) {
       return response.status(404).send();
   }

   Todo.findById(id).then(todoDoc => {
       if (!todoDoc) {
           return response.status(404).send();
        }

       response.send({todoDoc});

   }).catch(error => {
       response.status(400).send();
   });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
