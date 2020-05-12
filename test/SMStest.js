var request = require('request');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;


console.log("process.env.TWILIO_ACCOUNT_SID : " + process.env.TWILIO_ACCOUNT_SID)
console.log("process.env.TWILIO_AUTH_TOKEN : " + process.env.TWILIO_AUTH_TOKEN);


const client = require('twilio')(accountSid, authToken);

const fetchQuoteAndSendSMS = (id) => {
    id = '000002';
    var requestOptions = {
        'url': `https://api.tiingo.com/tiingo/daily/${id}/prices?token=8451865a9ee4e0519f99d1bfe3f99d05e83470bc`,
        'headers': {
            'Content-Type': 'application/json'
        }
    };

    request(requestOptions,
        function (error, response, data) {
            const quote = JSON.parse(data)[0];
            Object.assign(quote, { id: id, dreamPrice: 15 });
            //check you price
            if (parseInt(quote.adjHigh) > parseInt(quote.dreamPrice)) {
                sendSMS({ quote });
            }
        }
    );
}

const sendSMS = ({ quote }) => {

    const sms = quote.id
    ",日期：" + quote.date.substring(0, 10) +
        ",开盘价 : " + quote.adjOpen +
        "元,收盘价 : " + quote.adjClose +
        "元,最高价 ： " + quote.adjHigh +
        "元,最低价 : " + quote.adjLow + "元";

    console.log(sms)

    client.messages
        .create({
            body: "002739, 2020-04-21,s:14.9元,e:14.91元,h:15.17元,l:14.5,alarmPrice:15",
            from: '+12029521055',
            to: '+8618588421319'
        })
        .then(message => console.log(message.sid));
}

fetchQuoteAndSendSMS()