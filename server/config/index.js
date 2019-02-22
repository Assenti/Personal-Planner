const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    port: process.env.PORT || 3000,
    mongoURI: process.env.MONGO,
    jwtSecret: process.env.JWT_SECRET,
    mailConfig: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, 
        auth: {
            user: process.env.MAIL_USER, 
            pass: process.env.MAIL_PASSWORD   
        }
    },
    session: '86400000'
}