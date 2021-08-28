const Todo = require('../models/Todo');
const createError = require('http-errors');

const addTodo = async (req, res) => {
    try {
        req.body.author = req.user;
        const todo = await Todo.create(req.body);
        console.log('todo: ', todo)
        if (!todo) {
            return res.status(401).send('Todo not added');
        }
        res.status(200).json(todo)
        } catch (err) {
            return res.status(400).send(err)
        }
}

const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({author: req.user._id})
        // .populate('author')
        .sort({createdAt: -1}).exec()
        res.status(200).json(todos)
    } catch (err) {
        return res.status(400).send(err)
    }
}

const editTodo = async (req, res) => {
    try {
        const editedTodo = await Todo.findOneAndUpdate({ _id: req.params.id }, req.body, {new: true}).exec()
        res.status(200).json(editedTodo)
    } catch (err) {
        return res.status(400).send(err)
    }
}

const getTodoById = async (req, res) => {
    try {
        const todo = await Todo.find({ _id: req.params.id }).exec()
        res.status(200).json(todo)
    } catch (err) {
        return res.status(400).send(err)
    }
}


const deleteTodo = async (req, res) => {
    try {
        const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id })
        if(!req.params.id) {
            return res.status(404).send();
        }
        res.status(200).send(deletedTodo)
    } catch (err) {
        return res.status(500).send(err)
    }
}


module.exports = {
    addTodo,
    getTodos,
    getTodoById,
    editTodo,
    deleteTodo
}
