const mongoose = require('mongoose')
const config = require('../config')
mongoose.connect(config.mongoURI, { useNewUrlParser: true })

const TodoSchema = mongoose.Schema({
	title: String,
	order: { type: Number, default: 0 },
	completed: {type: Boolean, default: false },
	important: {type: Boolean, default: false },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, 
	date: { type: Date, default: Date.now },
	expDate: { type: Date }
})

module.exports = mongoose.model('Todo', TodoSchema)