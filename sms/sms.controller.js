const express = require('express');
const smsService = require('./sms.service');
const router = express.Router();

router.post('/sendTestSMS', sendTestSMS);

router.get('/test', (req, res) => res.send('Got a GET request'))

router.get('/send-test', sendSMSbyGet);

function sendSMSbyGet(req,res,next) {
    console.log('####send-text');
    smsService.sendSMSbyGet();
    res.json({});
}

function sendTestSMS(req, res, next) {
    console.log("JSON.stringify(req.body) : " + JSON.stringify(req.body))
    smsService.sendTestSMS(req.body)
    // .then(() => res.json({}))
    // .catch(err => next(err));
    res.json({})
}

module.exports = router