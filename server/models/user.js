const mongoose = require('mongoose');

let Users = mongoose.model('users', {
    email:{
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});


module.exports = {Users};
