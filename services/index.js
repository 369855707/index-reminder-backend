const smsService = require('../dao');

const getStockQuote = params => {
    console.log('service params: ' + params.id);
    smsService.quoteTask(params.id);
}

const sendSMS = params => {
    console.log('service params: ' + params);
    smsService.sendSMS(params);
}

exports.getStockQuote = getStockQuote;


