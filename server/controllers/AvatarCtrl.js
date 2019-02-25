const jwt = require('jsonwebtoken')
const fs = require('fs')
const User = require('../models/User')
const path = require('path')

exports.setAvatar = (req, res) => {
	User.findById(req.body.userId).exec((err, user) => {
		if(err) {
            console.log(err)
            res.sendStatus(500)
        }
		else {
			let tempPath = path.resolve(req.file.path)
			let targetPath = path.resolve(__dirname, `../../public/uploads/${user._id}.${req.file.originalname.split('.').pop()}`);
			fs.rename(tempPath, targetPath, (err) => {
				if(err) {
                    console.log(err)
                    res.sendStatus(500)
                }
				else {
					user.avatar = `/uploads/${user._id}.${req.file.originalname.split('.').pop()}`
					user.save((err, user) => {
						if(err) {
                            console.log(err)
                            res.sendStatus(500)
                        }
						else res.send(user.avatar)
					})
				}
			})
		}
	})
}

exports.deleteAvatar = (req, res) => {
	User.findById(req.query.userId).exec((err, user) => {
        if(err) {
            res.sendStatus(500)
            console.log(err)
        }
        else {
            user.avatar = ''
            user.save((err, user) => {
                if(err) { 
                    console.log(err)
                    res.sendStatus(500) 
                }	
                else res.send(user.avatar)
            })
        }
    })
}