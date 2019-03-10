const jwt = require('jsonwebtoken')
const User = require('../models/User')
const config = require('../config')
const keygenerator = require('keygenerator')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport(config.mailConfig)
const MAIL = `"Personal Planner" <${config.mailConfig.auth.user}>`

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

exports.changePassword = (req, res) => {
	const userId = req.body.id
	const currentPassword = req.body.current
	const newPassword = req.body.new
	const currentEmail = req.body.email

	User.findById(userId)
	.exec((err, user)=> {
		if(err) {
			console.log(err)
			res.sendStatus(500)
		}
		else {
			user.comparePassword(currentPassword, (err, isEqual)=> {
				if(err) {
					console.log('Comparing password error: ' + err)
					res.sendStatus(500)
				}
				else if(!isEqual) res.sendStatus(401)
				else {
					bcrypt.genSalt(parseInt(config.bcryptLength), (err, salt)=> {
						if(err) {
							console.log(err)
							res.sendStatus(500)
						}
						else {
							bcrypt.hash(newPassword, salt, (err, hash)=> {
								if(err) {
									console.log(err)
									res.sendStatus(500)
								}
								else {
									User.updateOne({ _id: userId }, { $set: { password: hash }}, (err, user) => {
										if(err) {
											console.log(err)
											res.sendStatus(500)
										}
										else {
											let mailOptions = {
												from: MAIL, 
												to: currentEmail, 
												subject: `Change password`, 
												html: `<p>Your password successfully changed!</p>`
											}
											transporter.sendMail(mailOptions, (error, info)=> {
												if(error) {
													console.log(error)
													res.sendStatus(401)
												}
												else {
													console.log(info)
													res.sendStatus(200)
												}
											})
										}
									})
								}
							})
						}
					})
				}
			})
		}
	})
}

exports.resetPassword = (req, res) => {
	const currentEmail = req.query.email
	User.findOne({email: currentEmail })
	.exec((err, user)=> {
		if(err) {
			console.log(err)
			res.sendStatus(500)
		}
		else if(!user) {
			res.sendStatus(406)
		}
		else if(user){
			let newPass = keygenerator.password()
			bcrypt.genSalt(parseInt(config.bcryptLength), (err, salt)=> {
				if(err) return next(err)
				bcrypt.hash(newPass, salt, (err, hash)=> {
					if(err) {
						console.log(err)
						res.sendStatus(500)
					}
					else {
						User.updateOne({ email: currentEmail }, { $set: { password: hash }}, (err, user) => {
							if(err) {
								console.log(err)
								res.sendStatus(500)
							}
							else {
								let mailOptions = {
									from: MAIL, 
									to: currentEmail, 
									subject: `Reset password`, 
									html: `<p>Your new password ${ newPass }. Please change your password after authorization in app!</p>`
								}
								transporter.sendMail(mailOptions, (error, info)=> {
									if(error) {
										console.log(error)
										res.sendStatus(401)
									}
									else {
										console.log(info)
										res.sendStatus(200)
									}
								})
							}
						})
					}
				})
			})
		}
	})
}
