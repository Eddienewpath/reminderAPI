const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

let data ={
    id: 10
};
// takes an object and your secrete
// return token and send back to user when they signup or login
let token = jwt.sign(data, '123abc');
console.log(token);
// decode the toekn back to our data 
let decoded = jwt.verify(token, '123abc');
console.log(decoded);

// let msg = 'test out shaw256';
// // SHA256 returns an obeject, you need to turn it into string first. 
// console.log(SHA256(msg).toString());

// // console.log(JSON.stringify(SHA256(msg)));

// let data = {
//     id: 4
// };

// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data)+ 'secrete').toString()
// };

// token.data.id = 5;
// // client side rehash will not be the same as our hash
// // coz the middleman doesnot know the secrete. 
// token.hash = SHA256(JSON.stringify(token.data)).toString(); 

// let resultHash = SHA256(JSON.stringify(token.data)+ 'salt').toString();

// if(resultHash === token.hash){
//     console.log('data was not changed');
// }else {
//     console.log('data was changed');
// }


// JWT : JSON WEB TOKEN


