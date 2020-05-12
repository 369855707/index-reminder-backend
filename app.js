
const dotenv = require('dotenv');
const result = dotenv.config()

console.log("dotenv result : " + JSON.stringify(result.parsed))

const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('express-jwt')
const errorHandler = require('./_helpers/error-handler')
const config = require('./config.json')
const cron = require('node-cron')
const smsSchedule = require('./sms/sms.schedule')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use(jwt({ secret: config.secret }).unless({
    path: [
        '/users/register',
        '/users/authenticate',
        '/sms/test',
        '/sms/send-test'
    ]
}))

app.use('/users', require('./users/user.controller'));
app.use('/sms', require('./sms/sms.controller'));

app.use(errorHandler)

const port = process.env.NODE_ENV === 'produnction' ? (process.env.PORT || 80) : 4000

cron.schedule("0 20 * * * *", () => {
    smsSchedule.smsSchedule();
})

module.exports = app