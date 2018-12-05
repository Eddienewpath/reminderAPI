const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('unable to connect to mongodb server');
    }
    console.log('connected to mongodb server');
    const db = client.db('TodoApp');

    //deletemany, deleteOne, findOneAndDelete methods 

    // db.collection('Todos').deleteMany({text: 'eat lunch'}).then((result)=>{
    //     console.log(result);
    // });

    // db.collection('Todos').deleteOne({text: 'eat lunch'}).then((res)=> {
    //     console.log(res);
    // });


    // db.collection('Todos').findOneAndDelete({completed: false}).then((res)=> {
    //     console.log(res);
    // });

    // then() is optional as long as documents are deleted. 
    db.collection('Users').deleteMany({name: 'eddie'}).then((res) => {
        console.log(res);
    });

    db.collection('Users').findOneAndDelete({_id:
        new ObjectID("5c01ac72d12df71453ea9425")}).then((res) => {
        console.log(res);
    });

    





});