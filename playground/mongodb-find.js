//fetch data from mongo
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('unable to connect to mongodb server');
    }
    console.log('connected to mongodb server');
    const db = client.db('TodoApp');
    //find method return a mongodb cursor/ pointer to those documents. 
    // toArray method will return a promise
    //docs is the documents returned if it exists. 
    db.collection('Todos').find({
        _id: new ObjectID("5c01ab3ee84a8b141f67555c") // cannot just use the id string as the value because id value is a ObjectId object. 
    }).toArray().then((docs) => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('unable to fetch todos', err);
    }); // fetch all documents 
    client.close();


    // count number of documents in the Todos database
    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count} `);
    // }, (err) => {
    //     console.log('unable to fetch todos', err);
    // });

// find return cursor, toArray return promise, then is for promise chaining
    // db.collection('Users').find({name: 'eddie'}).toArray().then((docs)=> {
    //     console.log(docs);
    // }, (err) => {
    //     console.log('unable to fetch todos', err);
    // });
});
 