const {User} = require('./../models/user');

let authenticate = (req, res, next) => {
    // console.log(req);
    let token = req.header('x-auth');
    User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        
        req.user = user; // this will add a user object to the user property in req object
        req.token = token; // add token object to the end of req obj 
        next();
        //The Promise returned by catch() is rejected
    }).catch((e) => {
        res.status(401).send();
    });
}

module.exports = {authenticate};