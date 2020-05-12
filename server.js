require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('express-jwt')
const errorHandler = require('./_helpers/error-handler')
const config = require('./config.json')
const cron = require('node-cron')
const smsSchedule = require('./sms/sms.schedule')

var dotenv = require('dotenv');
dotenv.config();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

app.use(jwt({ secret: config.secret }).unless({
    path: [
        '/users/register',
        '/users/authenticate'
    ]
}))

app.use('/users', require('./users/user.controller'));
app.use('/sms', require('./sms/sms.controller'));

app.use(errorHandler)

const port = process.env.NODE_ENV === 'produnction' ? (process.env.PORT || 80) : 4000

cron.schedule("0 20 * * *", () => {
    smsSchedule.smsSchedule();
})

const server = app.listen(port, '192.168.10.218', () => {
    console.log('Server listening on port ' + port);
})