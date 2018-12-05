//library import
let express = require('express');
let bodyparser = require('body-parser'); // bodyparser will send json to the api server
// local import
let {mongoose} = require('./db/mongoose');
let {Todo} = require('./models/todo');
let {User} = require('./models/user');
const {ObjectId} = require('mongodb');
const port = process.env.PORT || 3000;


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
    if(!ObjectId.isValid(id)){
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
    if(!ObjectId.isValid(id)){
       return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((result) => {
        if(!result){
           return res.status(404).send();
        }
        res.status(200).send(result);
    }).catch((err) => {
        res.status(400).send();
    });
});

app.listen(port, () => {
    console.log('server is up on ' + port);
});


module.exports = {app};































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