const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');
const {User} = require('./../models/user');
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed'); 

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'this is test';

        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({text})
        .expect(200) 
        // response will be passed into here 
        .expect((res) => {
            expect(res.body.text).toBe(text);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            Todo.find({text}).then((todos) => {
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e) => {
                done(e);
            });
        });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
        .post('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .send({})
        .expect(400)
        .end((err, res) => {
            if(err){
                return done(err);
            }
            
            Todo.find().then((todos) => {
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e));
        });
    }); 
});

describe('GET /todos', ()=> {
    it('should get all todos', (done) => {
        request(app)
        .get('/todos')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        // this is  custom expect call 
        .expect((res)=> {
            expect(res.body.todos.length).toBe(1);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done);
    });

    it('should not return todo doc created by other users', (done) => {
        request(app)
        .get(`/todos/${todos[1]._id.toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
    
    it('should return 404 if todo not found', (done) => {
        request(app)
        .get(`/todos/${new ObjectID().toHexString()}`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .get(`/todos/123`)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        let hexId = todos[1]._id.toHexString();
        
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo._id).toBe(hexId);
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            
            Todo.findById(hexId).then((todo) => {
                expect(todo).not.toBeTruthy();
                done();
            }).catch((e)=> done(e));
            
        }); 
    });
// should not delete the todo that this user does not own.
    it('should not remove a todo', (done) => {
        let hexId = todos[0]._id.toHexString();
        
        request(app)
        .delete(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end((err, res) => {
            if(err){
                return done(err);
            }
            
            Todo.findById(hexId).then((todo) => {
                expect(todo).toBeTruthy();
                done();
            }).catch((e)=> done(e));
            
        }); 
    });

    it('should return 404 if todo not found', (done)=> {
        request(app)
        .delete(`/todos/${new ObjectID().toHexString()}`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done);
    });

    it('should return 404 if object id is invalid ', (done)=> {
        request(app)
        .delete(`/todos/123`)
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end(done);
    });
});

describe ('PATCH /todos/:id', () => {
    it('should update the todo', (done)=> {
        let hexId = todos[0]._id.toHexString();
        let text = 'text is changed for todo 1';
        
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[0].tokens[0].token)
        // send body to backend
        .send({
            completed : true,
            text
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(typeof res.body.todo.completedAt).toBe('number');
        })
        .end(done);    
    });

    it('should not update the todo of other user', (done)=> {
        let hexId = todos[0]._id.toHexString();
        let text = 'text is changed for todo 1';
        
        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        // send body to backend
        .send({
            completed : true,
            text
        })
        .expect(404)
        .end(done);    
    });

    it('should clear completedAt when todo is not completed', (done)=>{
        let hexId = todos[1]._id.toHexString();
        let text = 'text is changed for todo 2';

        request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send({
           text,
           completed: false
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toBeFalsy();
        })
        .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
            expect(res.body).toEqual({});
        })
        .end(done);
    });
});

describe ('POST /users', () => {
    it('should create a user', (done) => {
        let email = 'eddie@example.com';
        let password = 'testpass';

        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res) => {
            expect(res.headers['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
        })
        .end((err) => {
            if(err){
                return done(err);
            }
            User.findOne({email}).then((user) => {
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
            }).catch((e) => done(e)); ;
        });
    });
// toExist && toNotBe are no long valid
    it('should return validation errors if request invalid', (done) => {
        request(app)
        .post('/users')
        .send({email: 'hahha', password: '123'}) // validator inside user schema.
        .expect(400)
        .end(done);
    });

    it('should not create user if eamil in use', (done) => {
        request(app)
        .post('/users')
        .send({
            email: users[0].email,
            password: 'password123!'
        })
        .expect(400)
        .end(done);    
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
        .post('/users/login')
        .send({email: users[1].email, password: users[1].password})
        .expect(200)
        .expect((res) => {
            expect(res.header['x-auth']).toBeTruthy();
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            User.findById(users[1]._id).then((user) => {
                // toInclude is not a function and is replaced by toMatchObject()
                // because user[1] already login in with a token. 
                expect(user.tokens[1]).toMatchObject({
                    access : 'auth', 
                    token: res.header['x-auth']
                });
                done();
            }).catch((e) => done(e));
        });

    });

    it('should reject invalid login', (done) => {
        request(app)
        .post('/users/login')
        .send({
           email: users[1].email,
           password: users[1].password + 1
        })
        .expect(400)
        .expect((res) => {
            expect(res.header['x-auth']).toBeFalsy();
        })
        .end((err, res) => {
            if(err){
                return done(err);
            }
            
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(1);
                done();
            }).catch((e) => done());
        })
    });
});

describe('DELETE /users/me/token', () => {
   it('should remove auth token on logout', (done) => {
       request(app)
       .delete('/users/me/token')
       .set('x-auth', users[0].tokens[0].token)
       .expect(200)
       .end((err, res) => {
           if(err){
               return done(err);
           }

           User.findById(users[0]._id).then((user) => {
               expect(user.tokens.length).toBe(0);
               done();
           }).catch((e) => done(e));
       });
   }); 
});






