const mongoose = require('mongoose');

// Todo is a constructor function coz starts with capital letter. 
// you can create object like class object in java using new. 
// Schema: pattern/brief/mode....
// returns a Todo object constructor function. 

// ? means  optional parameter in typescript. 
//second param is a schema Object gets passed to the schema constructor
let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true, // must exist
        minlength: 1,
        trim: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    completedAt:{
        type: Number,
        default: null
    }
});

module.exports = {
    Todo
};