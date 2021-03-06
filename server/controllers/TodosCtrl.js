const jwt = require('jsonwebtoken')
const Todo = require('../models/Todo')
const config = require('../config')

exports.getTodos = (req, res) => {
    Todo.find({ user: req.query.userId })
    .exec((err, todos)=> {
        if(err) {
            console.log(err)
            res.sendStatus(500)
        }
        else res.send(todos)
    })
}

exports.search = (req, res) => {
    let regEx = new RegExp(`${req.query.search}`, 'i')
	Todo.find({ title: regEx, user: req.query.userId })
	.limit(10)
	.exec((err, todos) => {
		if(err) {
            console.log(err)
            res.sendStatus(500)
        }
		else res.send(todos)
	})
}

exports.createTodo = (req, res) => {
    let important = false

    if(req.body.priority === 'High') {
        important = true
    }

    let todo = new Todo({ 
        title: req.body.title,
        user: req.body.user,
        important: important,
        order: req.body.order,
        expDate: req.body.expDate 
    })
    todo.save((err, todo)=> {
        if(err) {
            console.log(err)
            res.sendStatus(500)
        }
        else res.send(todo)
    })
}


exports.editTodo = (req, res) => {
    Todo.findOne({ _id: req.body._id })
    .exec((err, todo)=> {
        if(err) {
            console.log(err)
            res.sendStatus(500)
        }
        else {
            todo.title = req.body.title 
            todo.save((err, todo)=> {
                if(err) {
                    console.log(err)
                    res.sendStatus(500)
                }
                else res.send(todo)
            })
        }
    })
}

exports.setUnsetCompleted = (req, res) => {
    Todo.findOne({ _id: req.query._id })
    .exec((err, todo)=> {
        if(err) {
            console.log(err)
            res.sendStatus(500)
        }
        else {
            todo.completed = req.query.completed
            todo.save((err, todo)=> {
                if(err) {
                    console.log(err)
                    res.sendStatus(500)
                }
                else res.send(todo)
            })
        }
    })
}

exports.setUnsetImportant = (req, res) => {
    Todo.findOne({ _id: req.query._id })
    .exec((err, todo)=> {
        if(err) {
            console.log(err)
            res.sendStatus(500)
        }
        else {
            todo.important = req.query.important
            todo.save((err, todo)=> {
                if(err) {
                    console.log(err)
                    res.sendStatus(500)
                }
                else res.send(todo)
            })
        }
    })
}

exports.deleteCompleted = (req, res) => {
    let todosIds = []
    for(let i = 0; i < req.body.todos.length; i++){
        todosIds.push(req.body.todos[i]._id)
    }

    Todo.deleteMany({ _id: todosIds }).exec((err, result)=>{
        if(err) {
            console.log(err)
            res.sendStatus(500)
        }
        else res.send(result)
    })
}

exports.deleteTodo = (req, res) => {
    Todo.remove({_id: req.query.todoId }).exec((err, result)=> {
        if(err) {
            console.log(err)
            res.sendStatus(500)
        }
        else res.send(result)
    })
}

exports.setOrder = (req, res) => {
    for(const todo of req.body.todos) {
        Todo.updateOne({_id: todo._id}, { $set: { order: todo.order }}, (err, result) => {
            if(err) {
                console.log(err)
            }
        })
    }
    res.sendStatus(200)
}


