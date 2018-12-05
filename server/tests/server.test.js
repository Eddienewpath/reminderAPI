const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {ObjectId} = require('mongodb');

const todos = [{
    _id:  new ObjectId(),
    text: 'first test todo',
}, {
    _id: new ObjectId(),
    text: 'second test todo'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        Todo.insertMany(todos); //db seeds 
    }).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'this is test';

        request(app)
        .post('/todos')
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
        .expect(200)
        // this is  custom expect call 
        .expect((res)=> {
            expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
            expect(res.body.todo.text).toBe(todos[0].text)
        })
        .end(done);
    });
    
    it('should return 404 if todo not found', (done) => {
        request(app)
        .get(`/todos/${new ObjectId().toHexString()}`)
        .expect(400)
        .end(done);
    });

    it('should return 404 for non-object ids', (done) => {
        request(app)
        .get(`/todos/123`)
        .expect(404)
        .end(done);
    });
});
