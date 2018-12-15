const {Todo} = require('./../../models/todo');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {User} = require('./../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'andrew@example.com',
    password: 'userOnePass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth'}, 'abc123').toString()
    }]  
}, {
    _id: userTwoId,
    email: 'gen@example.com',
    password: 'userTwoPass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth'}, 'abc123').toString()
    }]  
}];

const todos = [{
    _id:  new ObjectID(),
    text: 'first test todo',
    _creator: userOneId,
}, {
    _id: new ObjectID(),
    text: 'second test todo',
    completed: true,
    completedAt: 333,
    _creator: userTwoId,
}];

const populateTodos = (done) => {
    Todo.deleteMany({}).then(() => {
        // This function does not trigger save middleware.
        // that is why we do not use it in polulateUsers
        Todo.insertMany(todos); //db seeds 
    }).then(() => done());
};

const populateUsers = (done) => {
    User.deleteMany({}).then(() => {
        let userOne = new User(users[0]).save(); // return promise, and save() takes time
        let userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);// return when all promises resolved , userTwo
    }).then (()=> done());
};


module.exports = {
    todos, populateTodos, users, populateUsers
};