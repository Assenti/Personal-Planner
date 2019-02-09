const jwt = require('jsonwebtoken')
const fs = require('fs')


exports.setAvatar = (req, res) => {
    jwt.verify(req.token, 'secret', (err, authData) => {
		if(err) res.status(403).send('Session is expired, please pass the authorization')
		else {
			User.findById(req.body.userId).exec((err, user) => {
				if(err) res.status(500).send(err)
				else {
					let tempPath = path.resolve(req.file.path);
					let targetPath = path.resolve(__dirname, `../../public/uploads/${user._id}.${req.file.originalname.split('.').pop()}`);
					fs.rename(tempPath, targetPath, (err) => {
						if(err) res.status(500).send(err)
						else {
							user.avatar = `/uploads/${user._id}.${req.file.originalname.split('.').pop()}`
							user.save((err, user) => {
								if(err) res.status(500).send(err)
								else res.send(user.avatar)
							})
						}
					})
				}
			})
		}
	})
}
router.post('/setavatar', verifyToken, upload.single('file'), (req, res) => {
	
})

router.put('/deleteavatar', verifyToken, (req, res) => {
	jwt.verify(req.token, 'secret', (err, authData) => {
		if(err) res.status(403).send('Session is expired, please pass the authorization')
		else {
			User.findById(req.body.userId).exec((err, user) => {
				if(err) {
					res.status(500)
					console.log(err)
				}
				else {
					user.avatar = ''
					user.save((err, user) => {
						if(err) console.log(err) 	
						else res.send(user.avatar)
					})
				}
			})
		}
	})
})