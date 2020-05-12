const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log("process.env.TWILIO_ACCOUNT_SID : " + process.env.TWILIO_ACCOUNT_SID)
console.log("process.env.TWILIO_AUTH_TOKEN : " + process.env.TWILIO_AUTH_TOKEN);

const client = require('twilio')(accountSid, authToken);

const request = require('request');
const userService = require('../users/user.service');

const sendTestSMS = ({ id, sbid }) => {
    fetchQuoteAndSendSMS(id, sbid)
}

async function fetchQuoteAndSendSMS(id, sbid) {
    console.log('sms.service : sbid : ' + sbid + ' id : ' + id);

    const user = await userService.getById(id);

    //console.log('JSON USER : ' + JSON.stringify(user));
    const sb = user.subscribe.filter(sb => sbid === sb.id);

    const { code, alarmPrice } = sb[0]


    var requestOptions = {
        'url': `https://api.tiingo.com/tiingo/daily/${code}/prices?token=8451865a9ee4e0519f99d1bfe3f99d05e83470bc`,
        'headers': {
            'Content-Type': 'application/json'
        }
    };

    request(requestOptions,
        function (error, response, data) {
            //console.log("error : " + error);
            //console.log("response : " + JSON.stringify(response));
            console.log("data : " + data);
            const quote = JSON.parse(data)[0];
            Object.assign(quote, { code: code, alarmPrice: alarmPrice });
            sendSMS({ quote });
        }
    );
}

const sendSMS = ({ quote }) => {
    const sms = quote.code +
        ",date:" + quote.date.substring(0, 10) +
        ",open:" + quote.adjOpen +
        "close:" + quote.adjClose +
        "high:" + quote.adjHigh +
        "low:" + quote.adjLow +
        ",alarmPrice : " + quote.alarmPrice;

    console.log(new Date() + sms)

    client.messages
        .create({
            body: sms,
            from: '+12029521055',
            to: '+8618588421319'
        })
        .then(message => console.log(message.sid));
}

const sendSMSbyGet = () => {
    client.messages
        .create({
            body: "this is a sms sent by get request",
            from: '+12029521055',
            to: '+8618588421319'
        })
        .then(message => console.log(message.sid));
}

exports.sendTestSMS = sendTestSMS;
exports.sendSMSbyGet = sendSMSbyGet;