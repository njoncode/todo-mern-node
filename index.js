require('dotenv').config();

const express = require('express');
const app = express();
const morgan = require('morgan');
const connect = require('./connect');
const cors = require('cors');

const todoController = require('./controllers/todoController');
const userController = require('./controllers/userController');
const authController = require('./controllers/authController');


app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.post('/api/todo', authController, todoController.addTodo);
app.get('/api/todos', authController, todoController.getTodos);
app.get('/api/todo/:id', authController, todoController.getTodoById);
app.put('/api/todo/:id', authController, todoController.editTodo);
app.delete('/api/todo/:id', authController, todoController.deleteTodo);

app.post('/api/signup', userController.validateSignup, userController.signup);
app.post('/api/signin', userController.signin);


app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            status: error.status || 500,
            message: error.message
        }
    })
});

connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app')
    .then(() => app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    }))
    .catch(e => console.error(e))

