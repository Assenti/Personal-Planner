const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const AuthCtrl = require('../controllers/AuthCtrl')
const TodosCtrl = require('../controllers/TodosCtrl')
const JwtService = require('../services/JwtService')
const AvatarCtrl = require('../controllers/AvatarCtrl')
const SendCtrl = require('../controllers/SendCtrl')

router.post('/signin', AuthCtrl.signin)

router.post('/register', AuthCtrl.register)

router.get('/logout', AuthCtrl.logout)

router.get('/resetPassword', AuthCtrl.resetPassword)

router.post('/changePassword', AuthCtrl.changePassword)

router.get('/getTodos', TodosCtrl.getTodos)

router.get('/search', TodosCtrl.search)

router.post('/createTodo', TodosCtrl.createTodo)

router.put('/editTodo', TodosCtrl.editTodo)

router.get('/setUnsetCompleted', TodosCtrl.setUnsetCompleted)

router.get('/setUnsetImportant', TodosCtrl.setUnsetImportant)

router.put('/deleteCompleted', TodosCtrl.deleteCompleted)

router.delete('/deleteTodo', TodosCtrl.deleteTodo)

router.post('/setOrder', TodosCtrl.setOrder)

router.post('/sendToEmail', SendCtrl.sendToEmail)

router.post('/setAvatar', upload.single('file'), AvatarCtrl.setAvatar)

router.get('/deleteAvatar', AvatarCtrl.deleteAvatar)

module.exports = router