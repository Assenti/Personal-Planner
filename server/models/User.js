const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
	firstname: String,
	lastname: String,
	email: { type: String, unique: true},
	password: String,
	avatar: String,
	todos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Todo'}], 
	date: {type: Date, default: Date.now }
})

UserSchema.pre('save', function (next) {
	var user = this;
	if(!user.isModified('password')){
		return next()
	}

	bcrypt.genSalt(10, (err, salt)=> {
		if(err) return next(err)
		bcrypt.hash(user.password, salt, (err, hash)=> {
			if(err) return next(err)
			user.password = hash
			next()
		})
	})
})


UserSchema.methods.comparePassword = function(password, next) {
	var user = this;

	bcrypt.compare(password, user.password, (err, isEqual)=> {
		if(err) return next(err)
		return next(null, isEqual)
	})
}

module.exports = mongoose.model('User', UserSchema)