const {ObjectID} = require('mongodb');// loading Mongodb native object id driver
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/user');

// let id = '5c063edf4651494bd8b525bdd';// invalid id

// if(!ObjectID.isValid(id)){
//     console.log('invalid object id');
// }

// Todo.find({
//     _id : id
// }).then((todos) => {
//     console.log('find all', todos);
// }); // todos is an array 


// Todo.findOne({
//     _id : id
// }).then((todo) => {
//     console.log('find one id:', todo);
// });

// Todo.findById(id).then((todo) => {
//     if(!todo){
//         return console.log('id not found');
//     }
//     console.log('find by id:', todo);
// }).catch((e) => {
//     console.log(e);
// });


let id ='5c07117afd3c3a3794b5bd23';


Users.findById(id).then((user) => {
    if(!user){
        return console.log('user not found');
    }
    console.log('find by id', user);
}).catch((e) => {
    console.log(e);
});