// function Person(first, last, age, eye) {
//     this.firstName = first;
//     this.lastName = last;
//     this.age = age;
//     this.eyeColor = eye;
//     console.log(this);
// }

// Person('eddie', 'dong', 29, 'brown');




// in a method, this refers to the owner object
// let obj = {
//     name : 'eddie',
//     age: 30,
//     myfunc: function(){
//         console.log(this);
//     }, 
// };

// obj.myfunc();

// alone, this refers to "global" in nodejs, 'window' in browser

// when this in a function, this refers to 'global', this function is a method property of global. 
// function myfunction(){
//     console.log(this);
// }
// myfunction();

// you can add properties to global object. 
// function myFunction() {
//     this.x = 1;
//     this.y = 2;
//     console.log(this);
// }

// myFunction();

// let obj = function(){
//     let user = this;
//     user.x = 0;
//     console.log(user);
// }

// obj();

// let data = {
//     id: 1,
//     age: 25,
//     func: null
// };
// // this refers to the owner object. 
// data.func = function() {
//     console.log(this);
// }
// data.func();


