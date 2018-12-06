//Node_ENV is an environment variable for Heroku and local nodejs
//Node_ENV by default at Heroku is a string 'production'
// so we can set local Node_ENV as 'test'
// we want to separate the database for development and test and production

// process.env.NODE_ENV will take care the production and test database
// string 'development will set the env as for development purpose'

let env = process.env.NODE_ENV || 'development';

if(env === 'development'){
    process.env.PORT = 3000;
    // if production, heroku will provide URI 
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
}else if (env === 'test'){
    process.env.PORT = 3000;
    // this will create a new database
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}

