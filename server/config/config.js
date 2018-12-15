//Node_ENV is an environment variable for Heroku and local nodejs
//Node_ENV by default at Heroku is a string 'production'
// so we can set local Node_ENV as 'test'
// we want to separate the database for development and test and production

// process.env.NODE_ENV will take care the production and test database
// string 'development will set the env as for development purpose'

let env = process.env.NODE_ENV || 'development';

// if(env === 'development'){
//     process.env.PORT = 3000;
//     // if production, heroku will provide URI 
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// }else if (env === 'test'){
//     process.env.PORT = 3000;
//     // this will create a new database
//     process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }

// we load in config.json and igonre it in the repo to keep some of our info safe such jwt secret
if(env === 'test' || env === 'development'){
    let config = require('./config.json'); // this will turn json into js object
    let envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
        process.env[key] = envConfig[key];
    });

}

// using terminal to set production env for jwt secret: 
// enter: heroku config:set key=value  
// other command see command line help. 

// mongodb uri explained & setup for Robo 
// mongodb://heroku_2hxltslh:kf64qflm5qalkq2qdcu93vuplv@ds225624.mlab.com:25624/heroku_2hxltslh 
/*
everything between //....: is user name
between :....@ is password 
@....: is the address
:..../ is port number
:... end, is the database

use these information to set up Robo Mongo
 */

