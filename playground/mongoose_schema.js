const mongoose = require('mongoose');

let myScheam = new mongoose.Schema({
    name: String,
    age: Number
});

// myScheam.statics.dogFunc = function (){
//     let Dog = this;
//     console.log(Dog);
// }

myScheam.methods.dogF = function(){
    let dog = this;
    console.log(`this dog is ${dog}`);
}

let Dog = mongoose.model('dogs', myScheam);

// console.log(Dog);

// Dog.dogFunc();

let d = new Dog();
d.dogF();


