const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./server/config')
const routes = require('./server/routes')
const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, { useNewUrlParser: true })


// try {
//     mongoose.connect(config.mongoURI, { useNewUrlParser: true })
// }
// catch(e) {
//     console.log(e)
//     throw new Error('Mongo connection error: ' + e)
// }

const app = express()
app.use(express.static(path.join(__dirname, 'dist')))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(morgan('dev'))
app.use(cors())
app.use('/api', routes)
app.use('/main', (req, res) => { res.redirect('/')})

app.listen(config.port, ()=> console.log(`Server started on port ${config.port}...`))