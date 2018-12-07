const validator = require('validator');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

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
    let user = this;
    let access = 'auth';
    let token = jwt.sign({
        _id: user._id.toHexString(),
        access
    }, 'abc123').toString();
// add access and token data into user token array. 
    user.token = user.tokens.concat([{access, token}]);
    //save() returns a promise object
    return user.save().then(() => {
        return token;
    });
}
let User = mongoose.model('users', userSchema);


module.exports = {User};
