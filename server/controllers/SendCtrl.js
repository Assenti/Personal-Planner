const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const config = require('../config')
const Todo = require('../models/Todo')
const transporter = nodemailer.createTransport(config.mailConfig)
const MAIL = `"Personal Planner" <${config.mailConfig.auth.user}>`


exports.sendToEmail = (req, res) => {
	let currentDate = req.body.currentDate
	let todosLenght = req.body.todos.length
	let content = req.body.todos.toString().replace(/,/g, ';<br>')
	let email = req.body.email

	let mailOptions = {
		from: MAIL, 
		to: email, 
		subject: `Todo List on ${ currentDate }`, 
		html: `<p><strong>Todo list for ${ currentDate }</strong></p>
			<p>You have <strong>${ todosLenght }</strong> items in todo list</p>
			<p>${ content }</p>`
	}

	if(req.body.currentDate && req.body.todos && req.body.email) {
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
	else {
		res.sendStatus(401)
	}
	
}