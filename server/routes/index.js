const express = require('express')
const router = express.Router()
const AuthCtrl = require('../controllers/AuthCtrl')

router.post('signin', AuthCtrl.signin)

router.post('register', AuthCtrl.register)

router.get('/logout', AuthCtrl.logout)

module.exports = router