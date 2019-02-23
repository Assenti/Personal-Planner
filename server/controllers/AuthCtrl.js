const jwt = require('jsonwebtoken')
const User = require('../models/User')
const config = require('../config')

exports.register = (req, res) => {
	User.findOne({email: req.body.email }).exec((err, email)=> {
		if(err) {
			console.log(err)
			res.sendStatus(500)
		}
		else if(email) {
			res.sendStatus(406)
		}
		else {
			let user = new User({
				firstname: req.body.firstname,
				lastname: req.body.lastname,
				email: req.body.email,
				password: req.body.password
			})

			user.save((err, user)=> {
				if(err) {
					console.log(err)
					res.sendStatus(500)
				}
				else res.sendStatus(200)
			})
		}
	})
}

exports.signin = (req, res) => {
	User.findOne({ email: req.body.email })
	.exec((err, user)=> {
		if(err) {
			console.log(err)
			res.sendStatus(500)
		}
		else if(!user) res.sendStatus(401)
		else {
			user.comparePassword(req.body.password, (err, isEqual)=> {
				if(err) {
					console.log('Comparing password error: ' + err)
					res.sendStatus(500)
				}
				else if(!isEqual) res.sendStatus(401)
				else {
					if(req.body.rememberme) {
						jwt.sign(user.toJSON(), config.jwtSecret, (err, token) => {
							if(err) { 
								console.log(err)
								res.sendStatus(500)
							}
							else {
								res.cookie('token', token)
								res.send(user)
							}
						})
					}
					else if(!req.body.rememberme) {
						jwt.sign(user.toJSON(), config.jwtSecret, { expiresIn: config.session }, (err, token) => {
							if(err) { 
								console.log(err)
								res.sendStatus(500)
							}
							else {
								res.cookie('token', token, { maxAge: config.session })
								res.send(user)
							}
						})
					}
				}
			}) 
		}
	})
}

exports.logout = (req, res) => {
	res.clearCookie('token')
	res.sendStatus(200)
}
