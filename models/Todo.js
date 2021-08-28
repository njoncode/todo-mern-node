const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    todo: {
        type: String,
        required: true,
        unique: true
    }, 
    author: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: 'You must supply an author'
    }]
}, {timestamps: true})

module.exports = mongoose.model('Todo', todoSchema)