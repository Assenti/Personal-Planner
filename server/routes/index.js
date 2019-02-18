const express = require('express')
const router = express.Router()
const AuthCtrl = require('../controllers/AuthCtrl')
const TodosCtrl = require('../controllers/TodosCtrl')
const JwtService = require('../services/JwtService')

router.post('/signin', AuthCtrl.signin)

router.post('/register', AuthCtrl.register)

router.get('/logout', AuthCtrl.logout)

router.get('/getTodos', TodosCtrl.getTodos)

router.get('/search', TodosCtrl.search)

router.post('/createTodo', TodosCtrl.createTodo)

router.put('/editTodo', TodosCtrl.editTodo)

router.put('/deleteCompleted', TodosCtrl.deleteCompleted)

router.delete('/deleteTodo', TodosCtrl.deleteTodo)

module.exports = router