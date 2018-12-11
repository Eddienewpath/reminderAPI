const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

let userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        
        validate: {
            // short way[validator: validator.isEmail,]
            validator: (value) => {
                return validator.isEmail(value);
            },
            
            message: '{VALUE} is not a valid email'
        }
    },
    
    password: {
        type: String,
        require: true,
        minlength: 6
    },

    tokens: [{
            
        access: {
            type: String,
            required: true
        },
        
        token: {
            type: String,
            required: true
        }
    }]
});

// Each Schema can define instance and static methods for its model.

// The return value of this method is used in calls to JSON.stringify
// see doc 
userSchema.methods.toJSON = function(){
    let user = this;
    //Converts this document into a plain javascript object
    let userObject = user.toObject();
    // so that the data sent back to user does not include sensitive information such password and token hash. 
    return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = function(){
    let user = this; // owner of this function is the object who calls it. since this is instance method, the single user document will call it. 
    let access = 'auth';
    let token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'abc123').toString();
// add access and token data into user token array. 
    user.tokens = user.tokens.concat([{access, token}]);
    //save() returns a promise object
    return user.save().then(() => {
        return token;
    });
};

// mongoose middleware, meaning before given event.  
userSchema.pre('save', function(next) {
    let user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) =>{
            bcrypt.hash(user.password, salt, (err, hash) =>{
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});

// allow for defining functions that exist directly on your Model.
userSchema.statics.findByToken = function (token) {
    // this here meaning the User model
    let User = this;
    let decoded; // leave it undefined coz jwt.verify() will throw an err if user not found or ..

    try{
        decoded = jwt.verify(token, 'abc123');
        // console.log(decoded);
    }catch(e){
        return new Promise((resolve, reject)=> {
            reject();
        });
        //promise rejections that are not handled will terminate the Node.js process with a non-zero exit code
        // return Promise.reject();
    }

    //return a promise
    return User.findOne({
         _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

let User = mongoose.model('users', userSchema);
//module object has a nested exports object which has a User property.
module.exports = {User};
