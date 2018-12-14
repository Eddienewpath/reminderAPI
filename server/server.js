//library import
let express = require('express');
let bodyparser = require('body-parser'); // bodyparser will send json to the api server
const _ = require('lodash');
const bcrypt = require('bcryptjs');
// local import
require('./config/config'); // load in different db for development and test
let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
const {ObjectID} = require('mongodb');
const {authenticate} = require('./middleware/authenticate');
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

// as the second argument to refer to the authenticate function
app.get('/users/me', authenticate, (req, res)=>{
    console.log(res);
    res.send(req.user);
    // authenticate: 
    // let token = req.header('x-auth');
    // User.findByToken(token).then((user)=>{
    //     if(!user){
    //         return Promise.reject();
    //     }
        
    //     res.send(user);
    //     //The Promise returned by catch() is rejected
    // }).catch((e) => {
    //     res.status(401).send();
    // });
});

//delete user token from user tokens array.
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
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

// login 
app.post('/users/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    User.findByCredential(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((err) => {
        res.status(400).send();
    });
});


app.listen(port, () => {
    console.log('server is up on ' + port);
});


module.exports = {app};