const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if(err){
        return console.log('unable to connect to mongodb server');
    }
    console.log('connected to mongodb server');
    const db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID("5c032851fd3c3a3794b599e7")
    // }, {
    //     // mongodb update operators. see website for all the operators. 
    //     // cannot just 'completed: true', this will not work. 
    //     $set:{
    //         completed: true
    //     }
    // }, {
    //     returnOriginal : false
    // }).then((res) => {
    //     console.log(res);
    // });


    db.collection('Users').findOneAndUpdate(
        {
            _id: new ObjectID("5c01b07f80fb881500a82cff")
        },
        {
            $set:{
                name: 'eddie'
            },
            $inc: {
                age: 1
            }
        },
        {
          returnOriginal : false 
        }
    ).then((res) => {
        console.log(res);
    });

    client.close();
});