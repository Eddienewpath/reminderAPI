// mongoose configuration file

let mongoose = require('mongoose');
// using promise 
mongoose.Promise = global.Promise; // mongoose configured 
//mongoose is an ORM. 
//MONGODB_URI is given when you add mlab to this app in heroku
//you can find this uri at commandline: heroku config --app agile-anchorage-12891
mongoose.connect(process.env.MONGODB_URI,{ useCreateIndex: true });

module.exports = {
    mongoose
};