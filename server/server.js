'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo-model');
const {User} = require('./models/user-model');
const {xAuth} = require('./constants');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

/* Todos Requests */

app.post('/todos', (request, response) => {
    let todo = new Todo({
        text: request.body.text
    });

    todo.save().then(todoDoc => {
        response.send({todoDoc});
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

app.delete('/todos/:id', (request, response) => {
    let id = request.params.id;
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

    Todo.findByIdAndDelete(id).then(todoDoc => {
        if (!todoDoc) {
            return response.status(404).send();
        }

        response.send({todoDoc});
    }).catch(error => {
       response.status(400).send();
    });
});

app.patch('/todos/:id', (request, response) => {
    let id = request.params.id;
    let body = _.pick(request.body, ['text', 'completed']);
    if (!ObjectID.isValid(id)) {
        return response.status(404).send();
    }

   if (_.isBoolean(body.completed) && body.completed) {
       body.completedAt = new Date().getTime();
   } else {
       body.completedAt = null;
       body.completed = false;
   }

   Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then(todoDoc => {
       if (!todoDoc) {
           return response.status(404).send();
       }

       response.send({todoDoc});
   }).catch(error => {
       response.status(400).send();
   });
});

 /* User Requests */

app.post('/users', (request, response) => {
     let body = _.pick(request.body, ['email', 'password', 'name']);
     let user = new User(body);

     user.save().then(() => {
         return user.generateAuthToken();
     }).then((token) => {
         response.header(xAuth, token).send({user});
     }).catch(error => {
        response.status(400).send(error);
     });
});

// app.post('/users/me', authenticate, (request, response) => {
//     response.send(request.user);
// });

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
