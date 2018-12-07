//library import
let express = require('express');
let bodyparser = require('body-parser'); // bodyparser will send json to the api server
const _ = require('lodash');
// local import
require('./config/config'); // load in different db for development and test
let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
const {ObjectID} = require('mongodb');
const port = process.env.PORT;


let app = express();
// bodyparser.json() will return a method which is our middleware. 
app.use(bodyparser.json()); 

// note: function is an object and if function contains a property is a function, that funtion is called method.
app.post('/todos', (req, res)=> {
    // console.log(req.body); // body gets stored by bodyparser.
    // create an Todo object and add property to this obj. 
    let todo = new Todo({
        text: req.body.text
    }); 
    // this will send data with database _id to requestor
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    // Todo function object contains a query property find method. 
    // then() method returns a promise 
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});


app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) =>{
        if(!todo){
            return res.status(400).send();
        }
        res.send({todo});
    }).catch((err)=> {
        res.status(400).send();
    });
});

// .remove({}) this will remove all documents
// .findByIdAndRemove() will remove and return removed results. 
app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;
    if(!ObjectID.isValid(id)){
       return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
           return res.status(404).send();
        }
        res.send({todo});
    }).catch((err) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    // limite user request update for given item using pick method
    // only allow subset of things user passed to us
    let body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
// check if todo is completed
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }
// {new: true} update with the new version
    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send();
    });
});

// user sign up method. 
app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        // we need to send token in http header back to user. 
        // params are key-value pair, key is the custom header name and value is the token.
        // x-... to create a custom header. 
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.listen(port, () => {
    console.log('server is up on ' + port);
});


module.exports = {app};

/********************************* notes ******************************* */


// console.log(Todo); 
// let newTodo = new Todo({
//     text: 'cook rice',
// });

// newTodo.save().then((doc)=>{
//     console.log('save todo', doc)
// }, (err)=> {
//     console.log('unable to todo')
// });

// let newerTodo = new Todo({
//     text: 'eat dinner   ',
//     completed: true,
//     completedAt: 123
// });

// newerTodo.save();


// let newUser = new Users({
//     email: '  '
// });

// newUser.save().then((res)=>{
//     console.log('save user', res)
// }, (err) => {
//     console.log('unable to connect to User')
// });