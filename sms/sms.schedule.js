const userService = require('../users/user.service');
const request = require('request');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

console.log("schedule, process.env.TWILIO_ACCOUNT_SID : " + process.env.TWILIO_ACCOUNT_SID)
console.log("schedule, process.env.TWILIO_AUTH_TOKEN : " + process.env.TWILIO_AUTH_TOKEN);

const client = require('twilio')(accountSid, authToken);

function triggerAlarm({ code, alarmPrice }) {

    if (!code || !alarmPrice) {
        console.log("invalid subscription, code : " + code + ', alarmPrice : ' + alarmPrice)
        return
    }

    var requestOptions = {
        'url': `https://api.tiingo.com/tiingo/daily/${code}/prices?token=8451865a9ee4e0519f99d1bfe3f99d05e83470bc`,
        'headers': {
            'Content-Type': 'application/json'
        }
    };

    request(requestOptions, (err, res, body) => {
        if (err) {
            return console.log(err);
        }
        if (Array.isArray(JSON.parse(body))) {
            const quote = JSON.parse(body)[0];
            Object.assign(quote, { code: code, alarmPrice: alarmPrice });
            console.log(quote)
            if (alarmPrice < quote.adjHigh) {
                sendSMS({ quote });
            } else {
                console.log('scan finished, ' +code+ ' not hit the ' + alarmPrice + ' yet');
                return
            }
        } else {
            console.log(code + ' is a valid index');
            return
        }
    }
    );
}

const smsSchedule = () => {

    //read user
    userService.getAll()
        .then(users => {
            users.map(user => {
                user.subscribe.map(subscription => {
                    triggerAlarm(subscription)
                })
            });
        })
        .catch(err => console.log(err));
}


const sendSMS = ({ quote }) => {

    const sms = quote.code + " hit alarmprice, " + quote.alarmPrice + " at " + quote.date.substring(0, 10);

    console.log(sms)

    client.messages
        .create({
            body: sms,
            from: '+12029521055',
            to: '+8618588421319'
        })
        .then(message => console.log(message.sid));
}

exports.smsSchedule = smsSchedule;