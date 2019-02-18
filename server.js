const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const morgan = require('morgan')
const config = require('./server/config')

mongoose.connect(config.mongoURI, { useNewUrlParser: true })

const app = express()
app.use(express.static(path.join(__dirname, 'dist')))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors())
app.use('/api', require('./server/routes'))
// app.get('/', (req, res)=> {
// 	res.redirect('/#' + req.originalUrl)
// })

app.listen(config.port, ()=> console.log(`Server started on port ${config.port}...`))