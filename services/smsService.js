const smsDao = require('../dao/smsDao')

const sendSMS = ({ recipient, textmessage }) => {
    console.log('smsService params: ' + recipient + ' : ' + textmessage);
    smsDao.sendSMS({ recipient, textmessage })
}

exports.sendSMS = sendSMS;