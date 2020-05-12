const mongoose = require('mongoose')
//mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true })
console.log("###MONGODB_URI : " + process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI , { useUnifiedTopology: true, useCreateIndex: true, useNewUrlParser: true })
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model')
}