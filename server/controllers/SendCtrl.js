const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const config = require('../config')
const Todo = require('../models/Todo')
const transporter = nodemailer.createTransport(config.mailConfig)
const MAIL = `"Personal Planner" <${config.mailConfig.auth.user}>`


exports.sendToEmail = (req, res) => {
	jwt.verify(req.token, config.jwtSecret, (err, authData) => {
		if(err) {
            console.log(err)
            res.sendStatus(403)
        }
		else {
			Todo.find({ user: req.body.userId })
			.populate('user')
			.exec((err, todos) => {
				if(err) {
					console.log(err)
					res.sendStatus(500)
				}
				else {
					let currentDate = new Date()
					let content = ''
					let activeTodos = 0
					for(let i = 0; i < todos.length; i++){
						if(!todos[i].completed) {
							activeTodos++
							content += i+1 + ') ' + todos[i].title + '; '
						}
					}
					
					let mailOptions = {
						from: MAIL, 
						to: todos[0].user.email, 
						subject: `Todo List on ${ currentDate.toDateString() }`, 
						html: `<p>You have ${ activeTodos } items in todo list</p>
							<p>Todo list for ${ currentDate.toDateString() }</p>
							<p>${ content }</p>`
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