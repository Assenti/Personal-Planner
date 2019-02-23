const express = require('express')
const router = express.Router()
const AuthCtrl = require('../controllers/AuthCtrl')
const TodosCtrl = require('../controllers/TodosCtrl')
const JwtService = require('../services/JwtService')
const SendCtrl = require('../controllers/SendCtrl')

router.post('/signin', AuthCtrl.signin)

router.post('/register', AuthCtrl.register)

router.get('/logout', AuthCtrl.logout)

router.get('/getTodos', TodosCtrl.getTodos)

router.get('/search', TodosCtrl.search)

router.post('/createTodo', TodosCtrl.createTodo)

router.put('/editTodo', TodosCtrl.editTodo)

router.get('/setUnsetCompleted', TodosCtrl.setUnsetCompleted)

router.get('/setUnsetImportant', TodosCtrl.setUnsetImportant)

router.put('/deleteCompleted', TodosCtrl.deleteCompleted)

router.delete('/deleteTodo', TodosCtrl.deleteTodo)

router.post('/sendToEmail', SendCtrl.sendToEmail)

module.exports = router