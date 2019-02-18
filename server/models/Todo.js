const mongoose = require('mongoose')

const TodoSchema = mongoose.Schema({
	title: String,
	completed: {type: Boolean, default: false },
	important: {type: Boolean, default: false },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
	date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Todo', TodoSchema)